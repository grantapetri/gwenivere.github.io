local RepStore = game:GetService("ReplicatedStorage")
local SpringState = require(RepStore.Modules.Spring.SpringState)
local GunState = require(script.Parent.GunState)
local ProjController = require(RepStore.Modules.Projectile.ProjectileController)

local plr = game.Players.LocalPlayer

local Gun = {}

-- reload stages:
-- 0 = idle (not reloading)
-- 1 = reloadStart
-- 2 = reloadBody       (loops back to itself if continuous and not full / reserve remains)
-- 3 = reloadEnd
-- 4 = manualBoltOpen   (only entered if chamber was empty when reload started)
-- 5 = manualBoltClose  (only entered if chamber was empty when reload started)

-- bolt-cycle phases (post-fire automatic cycling):
-- 0 = idle
-- 1 = boltOpen
-- 2 = boltClose

local function impulseAimSprings(tool, input)

    tool.springs.pAimX.target = -input.X
    tool.springs.pAimY.target = input.Y
    tool.springs.pAimZ.target = -input.Z
end

local function playSoundGroup(tool, sounds)
    for _, sound in ipairs(sounds) do
        sound:Play()
    end
end

local function playEffectsGroup(tool, effects)
    for _, effect in ipairs(effects) do
        effect:Emit(10)
    end
end

local function visualFire(tool, input)
    
    playSoundGroup(tool, tool.model.Dynamic.FirePart.Sounds:GetChildren())
    playEffectsGroup(tool, tool.model.Dynamic.FirePart.MuzzleFlash:GetChildren())

    SpringState.impulseSpring(tool.config.springConfigs["pBlowX"], tool.springs.pBlowX, input / 5)
    SpringState.impulseSpring(tool.config.springConfigs["pBlowY"], tool.springs.pBlowY)
    SpringState.impulseSpring(tool.config.springConfigs["pBlowZ"], tool.springs.pBlowZ)

    SpringState.impulseSpring(tool.config.springConfigs["rBlowX"], tool.springs.rBlowX, input)
    SpringState.impulseSpring(tool.config.springConfigs["rBlowY"], tool.springs.rBlowY)
    SpringState.impulseSpring(tool.config.springConfigs["rBlowZ"], tool.springs.rBlowZ)
end

local function getRecoilImpulse()
    return math.sin(tick() * 1.0) * 0.5 +
        math.cos(tick() * 5.4) * 0.4 +
        math.sin(tick() * 8.7) * 0.3
end

-- helper to play an animation track if it exists
local function playAnim(tool, name)
    local track = tool.animTracks[name]
    if track then
        track:Play()
    end
    return track
end

local function stopAnim(tool, name)
    local track = tool.animTracks[name]
    if track then
        track:Stop()
    end
end

-- maps reload stage -> animation name, used to stop whichever stage we're leaving
local RELOAD_STAGE_ANIM = {
    [1] = "reloadStart",
    [2] = "reloadBody",
    [3] = "reloadEnd",
    [4] = "manualBoltOpen",
    [5] = "manualBoltClose",
}

-- maps bolt phase -> animation name, used to stop whichever phase we're leaving
local BOLT_PHASE_ANIM = {
    [1] = "boltOpen",
    [2] = "boltClose",
}

local function fire(tool)
    -- cannot fire while bolt is cycling
    if tool.boltPhase ~= 0 then
        return false
    end

    -- cannot fire while empty chamber
    if not tool.state.chamberLoaded then
        print("-click-")
        return false
    end

    tool.state.chamberLoaded = false
    ProjController.spawn(tool, tool.config.projectile)

    -- kick off automatic bolt cycle: boltOpen -> boltClose -> chambered
    tool.boltPhase = 1
    local track = playAnim(tool, "boltOpen")
    tool.boltTimer = track and track.Length or (tool.config.fireRate or 0.2) / 2

    return true
end

local function startBoltClose(tool)
    stopAnim(tool, BOLT_PHASE_ANIM[tool.boltPhase])
    tool.boltPhase = 2
    local track = playAnim(tool, "boltClose")
    tool.boltTimer = track and track.Length or (tool.config.fireRate or 0.2) / 2
end

local function finishBoltCycle(tool)
    stopAnim(tool, BOLT_PHASE_ANIM[tool.boltPhase])
    tool.boltPhase = 0
    tool.boltTimer = 0

    if tool.state.ammo > 0 then
        tool.state.ammo -= 1
        tool.state.chamberLoaded = true
        print("chamber loaded")
    end

    -- bolt cycle finished and nothing else is going on, resume idle
    if tool.reloadStage == 0 then
        playAnim(tool, "hold")
    end
end

function Gun.attach(instance, config, viewModel)
    local tool = {}

    tool.state = instance
    tool.config = config
    tool.viewModel = viewModel

    -- spawn weapon model
    local model = config.prefab:Clone()
    model.Parent = viewModel.model

    tool.model = model

    -- attach to socket
    local socket = viewModel.model.RightArm
    if socket and model.PrimaryPart then
        model:PivotTo(socket.CFrame)

        local joint = Instance.new("Motor6D")
        joint.Name  = "Base"
        joint.Part0 = socket
        joint.Part1 = model.PrimaryPart
        joint.Parent = socket
    end

    tool.boltPhase = 0
    tool.boltTimer = 0

    tool.reloadTimer = 0
    tool.reloadStage = 0 -- see stage comments at top of file
    tool.reloadFromEmpty = false -- whether this reload needs manual bolt open/close

    tool.burstRemaining = 0
    tool.burstTimer = 0

    tool.aimRotation = CFrame.identity

    tool.springs = {

        camRecoilY = SpringState.initState(config.springConfigs["camRecoilY"]),
        camRecoilZ = SpringState.initState(config.springConfigs["camRecoilZ"]),
        camRecoilX = SpringState.initState(config.springConfigs["camRecoilX"]),

        pAimX      = SpringState.initState(config.springConfigs["pAimX"]),
        pAimY      = SpringState.initState(config.springConfigs["pAimY"]),
        pAimZ      = SpringState.initState(config.springConfigs["pAimZ"]),

        rAimX      = SpringState.initState(config.springConfigs["rAimX"]),
        rAimY      = SpringState.initState(config.springConfigs["rAimY"]),
        rAimZ      = SpringState.initState(config.springConfigs["rAimZ"]),

        pBlowX     = SpringState.initState(config.springConfigs["pBlowX"]),
        pBlowY     = SpringState.initState(config.springConfigs["pBlowY"]),
        pBlowZ     = SpringState.initState(config.springConfigs["pBlowZ"]),

        rBlowX     = SpringState.initState(config.springConfigs["rBlowX"]),
        rBlowY     = SpringState.initState(config.springConfigs["rBlowY"]),
        rBlowZ     = SpringState.initState(config.springConfigs["rBlowZ"]),

    }

    -- build an AnimationTrack for every animation listed in config, keyed by name
    tool.animTracks = {}

    for animName, animID in config.animations do
        local animInstance = Instance.new("Animation")
        animInstance.AnimationId = animID

        tool.animTracks[animName] = viewModel.model.AnimationController.Animator:LoadAnimation(animInstance)
    end

    if tool.animTracks.hold then
        tool.animTracks.hold.Looped = true
        tool.animTracks.hold:Play()
    end

    return tool
end

local function enterReloadStage(tool, stage)
    local previousStage = tool.reloadStage

    -- stop whatever was playing before this stage: either a prior reload-stage
    -- animation, or the idle hold if we're entering reload fresh from stage 0
    if previousStage == 0 then
        stopAnim(tool, "hold")
    else
        stopAnim(tool, RELOAD_STAGE_ANIM[previousStage])
    end

    tool.reloadStage = stage

    if stage == 1 then
        local track = playAnim(tool, "reloadStart")
        tool.reloadTimer = track and track.Length or 0.5
        print("starting reload")

    elseif stage == 2 then
        local track = playAnim(tool, "reloadBody")
        tool.reloadTimer = track and track.Length or 0.8
        print("reloading...")

    elseif stage == 3 then
        local track = playAnim(tool, "reloadEnd")
        tool.reloadTimer = track and track.Length or 0.5
        print("ending reload")

    elseif stage == 4 then
        local track = playAnim(tool, "manualBoltOpen")
        tool.reloadTimer = track and track.Length or 0.5
        print("manually opening bolt")

    elseif stage == 5 then
        local track = playAnim(tool, "manualBoltClose")
        tool.reloadTimer = track and track.Length or 0.5
        print("manually closing bolt")
    end
end

function Gun.update(tool, viewModel, input, dt)
    
    -- spring impulses
    if input.secondary.clicked then
        local aimOffset = tool.model.Dynamic.AimPart.CFrame:ToObjectSpace(
            viewModel.model.PrimaryPart.CFrame * tool.config.vmOffset:Inverse()
        )

        impulseAimSprings(tool, aimOffset)
    else
        impulseAimSprings(tool, CFrame.new(0, 0, 0))

        tool.aimRotation = CFrame.identity
    end

    -- update springs
    for name, state in tool.springs do
        SpringState.updateSpring(tool.config.springConfigs[name], state, dt)
    end

    -- automatic bolt-cycle ticking (post-fire eject/chamber)
    if tool.boltPhase ~= 0 then
        tool.boltTimer -= dt

        if tool.boltTimer <= 0 then
            if tool.boltPhase == 1 then
                startBoltClose(tool)
            elseif tool.boltPhase == 2 then
                finishBoltCycle(tool)
            end
        end
    end

    -- reload handling
    if tool.reloadStage ~= 0 then
        -- interruption check
        if tool.config.reloadBehavior.canInterrupt then
            if input.primary.justPressed and tool.reloadStage ~= 3 and tool.reloadStage ~= 4 and tool.reloadStage ~= 5 then
                enterReloadStage(tool, 3)
            end
        end

        if tool.reloadStage ~= 0 then -- reload has not finished

            tool.reloadTimer -= dt

            if tool.reloadTimer <= 0 then
                if tool.reloadStage == 1 then
                    -- reloadStart finished, begin the reload body
                    enterReloadStage(tool, 2)

                elseif tool.reloadStage == 2 then
                    -- reloadBody finished, apply the reload effect
                    tool.config.reloadBehavior.run(tool.state)

                    local isFull = tool.state.ammo >= tool.state.maxAmmo
                    local noReserve = tool.state.reserveAmmo <= 0

                    if tool.config.reloadBehavior.continuous and not isFull and not noReserve then
                        -- loop the body again for another round
                        enterReloadStage(tool, 2)
                    else
                        enterReloadStage(tool, 3)
                    end

                elseif tool.reloadStage == 3 then
                    -- reloadEnd finished
                    if tool.reloadFromEmpty then
                        enterReloadStage(tool, 4)
                    else
                        stopAnim(tool, "reloadEnd")
                        tool.reloadStage = 0
                        playAnim(tool, "hold")
                        print("reload ended")
                    end

                elseif tool.reloadStage == 4 then
                    -- manual bolt open finished, close it to chamber a round
                    enterReloadStage(tool, 5)

                elseif tool.reloadStage == 5 then
                    -- manual bolt close finished -> chamber a round, reload fully done
                    if tool.state.ammo > 0 then
                        tool.state.ammo -= 1
                        tool.state.chamberLoaded = true
                    end
                    stopAnim(tool, "manualBoltClose")
                    tool.reloadStage = 0
                    tool.reloadFromEmpty = false
                    playAnim(tool, "hold")
                    print("reload ended")
                end
            end

            return
        end
    end

    -- active burst handling
    if tool.burstRemaining > 0 then
        if tool.boltPhase == 0 then
            if fire(tool) then
                tool.burstRemaining -= 1
                visualFire(tool, getRecoilImpulse())
            else
                -- stop burst if we can't fire
                tool.burstRemaining = 0
            end
        end

        return
    end

    -- reload input
    if input.reload.justPressed then
        if tool.state.ammo < tool.state.maxAmmo and tool.state.reserveAmmo > 0 then
            tool.reloadFromEmpty = not tool.state.chamberLoaded
            enterReloadStage(tool, 1)
        end
        return
    end

    -- fire input
    local shouldFire = false

    if tool.config.fireMode == "Auto" then
        shouldFire = input.primary.clicked

    elseif tool.config.fireMode == "Semi" then
        shouldFire = input.primary.justPressed

    elseif tool.config.fireMode == "Burst" then
        if input.primary.clicked then
            tool.burstRemaining = tool.config.burstCount or 3
        end
    end

    if shouldFire and tool.boltPhase == 0 then
        if fire(tool) then
            visualFire(tool, getRecoilImpulse())
        end
    end
end

function Gun.getRender(tool)
    local blowPosition = CFrame.new(
        tool.springs.pBlowX.position,
        tool.springs.pBlowY.position,
        tool.springs.pBlowZ.position
    )

    local blowRotation = CFrame.fromEulerAnglesYXZ(
        tool.springs.rBlowY.position,
        tool.springs.rBlowX.position,
        tool.springs.rBlowZ.position
    )

    local aimPosition = CFrame.new(
        tool.springs.pAimX.position,
        tool.springs.pAimY.position,
        tool.springs.pAimZ.position
    )
    
    plr.PlayerScripts.CameraController.CameraCalculations:Fire(Vector3.new(blowPosition.X / 2, -blowPosition.Y / 2, 0))

    return aimPosition * blowPosition * blowRotation
end

function Gun.unequip(tool)
    if tool.animTracks then
        for _, track in tool.animTracks do
            track:Stop()
        end
    end

    if tool.model then
        tool.model:Destroy()
        tool.model = nil
    end
end

return Gun
