
import { sendAction } from './utils/sketch';
import '../scss/index.scss';

document.querySelector('button').onclick = () => {
    sendAction('foo', {foo: 'bar'});
    
    const pre = document.createElement('pre');
    pre.append('SENT: ' + JSON.stringify({name: 'foo', payload:{foo:'bar'}}, null, 2));
    document.querySelector('.app-content').appendChild(pre);
};

window.addEventListener('foo', (ev:CustomEvent) => {
    const pre = document.createElement('pre');
    pre.append('RECEIVED: ' + JSON.stringify(ev.detail, null, 2));
    document.querySelector('.app-content').appendChild(pre);
});
