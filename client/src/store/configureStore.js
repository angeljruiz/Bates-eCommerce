import { createStore} from 'redux';

export default () => {
    return createStore( (state = {tester: 'hello'}) => { return state});
}