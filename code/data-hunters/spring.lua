local SpringData = require(script.Parent.SpringData)

local SpringState = {}

function SpringState.initState()
    return {
        target   = 0,
        position = 0,
        velocity = 0
    }
end

function SpringState.impulseSpring(config, state, input)
    input = input or 1
    state.velocity += input * config.fixedImpulse
end

function SpringState.updateSpring(config, state, dt)
    local displacement = state.position - state.target

    local acceleration =
        -config.tension * displacement
        -config.density * state.velocity

    state.velocity += acceleration * dt
    state.position += state.velocity * dt
end

return SpringState
