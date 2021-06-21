
import {PlayerStates} from "./PlayerStates";

// ECS
import FiniteStateMachine from "@EntityComponentCore/utils/FiniteStateMachine";

class PlayerFiniteStateMachine extends FiniteStateMachine {
    constructor(proxy) {
        super();
        this._proxy = proxy;
        this._Init();
    }

    _Init() {
        this._AddState('idle', PlayerStates.IdleState);
        this._AddState('run', PlayerStates.RunState);
        this._AddState('doge', PlayerStates.DogeState);
    }
};

export default PlayerFiniteStateMachine;
