local RepStore = game:GetService("ReplicatedStorage")
local Ping     = require(RepStore.Modules.Networking.PingTimes)
local ProjData = require(script.Parent.ProjectileData)

local Projectile = {}

Projectile.__index = Projectile

WEIGHT = 0.1
GRAVITY = -workspace.Gravity
METERS_PER_STUD = 3.571

function Projectile:NextPosition(dt)
    self.yVelocity += GRAVITY * dt
    self.airTime += dt

    local newPosition = (self.projectileObj.Position + self.direction * (self.xVelocity * dt)) + Vector3.new(0, self.yVelocity * dt, 0)
    --newPosition += Vector3.new(0, self.y, 0)

    return newPosition
end

function Projectile.NewProjectileObj(cf)
    local projectileObj = Instance.new("Part")
    projectileObj.Name = "Projectile"
    projectileObj.Size = Vector3.new(0.2, 0.2, 0.2)
    projectileObj.CanCollide = false
    projectileObj.Anchored = true
    projectileObj.Color = Color3.fromRGB(255, 0, 0)
    projectileObj.Material = Enum.Material.Neon
    projectileObj.CFrame = cf

    projectileObj.Touched:Connect(function()
        -- empty touch event to tell engine that we still want to receive touch events on this object despite its cancollide being false
    end)

    projectileObj.Parent = workspace.Projectiles

    return projectileObj
end

function Projectile:VisualizeTrajectory(startPoint, endPoint)
    local distance = (endPoint - startPoint).Magnitude

    local p = Instance.new("Part")
    p.Anchored = true
    p.CanCollide = false
    p.Size = Vector3.new(0.1, 0.1, distance)
    p.Color = Color3.fromRGB(math.random(0, 255), math.random(0, 255), math.random(0, 255))
    p.CFrame = CFrame.new(startPoint, endPoint)*CFrame.new(0, 0, -distance/2)
    p.Parent = self.projectileObj
end

function Projectile:TrajectoryCollides(start, goal, ignore, thisTrajectory)

    if thisTrajectory == nil then
        thisTrajectory = {start}
    end

    local raycastParams = RaycastParams.new()
    raycastParams.FilterDescendantsInstances = {workspace.Projectiles, table.unpack(ignore)}
    raycastParams.FilterType = Enum.RaycastFilterType.Exclude

    local raycastResult = workspace:Raycast(start, goal - start, raycastParams)

    if raycastResult then -- continue if raycast intersects something
        if raycastResult.Instance.Material == Enum.Material.Glass then -- penetrable
            table.insert(ignore, raycastResult.Instance) -- add the penetrable object to the ignore list and continue raycast
            return self:TrajectoryCollides(raycastResult.Position, goal, ignore, thisTrajectory) -- return the cast between the penetrable object and the goal

        else -- impenetrable
            self.travelTime = self.startTime - workspace:GetServerTimeNow()
            self.collided = raycastResult.Instance
            return raycastResult
        end
    else

    end
end

function Projectile.Create(startCF, bulletName)
    local self = {}

    self.bullet = ProjData.GetProjData(bulletName)

    self.projectileObj = Projectile.NewProjectileObj(startCF)
    self.direction = -startCF.LookVector
    self.airTime = 0

    self.xVelocity = (self.bullet.velocity) * METERS_PER_STUD -- projectile velocity
    self.yVelocity = 0

    self.startTime = workspace:GetServerTimeNow()
    self.trajectory = {} -- stores a start, any collisions inbetween, and an end to a part of the trajectory calculation for replication
    self.collided = nil

    return setmetatable(self, Projectile)
end

function Projectile:GetData()
    return {
        startTime  = self.startTime,
        travelTime = self.airTime,
        collided   = self.collided,
    }
end

return Projectile
