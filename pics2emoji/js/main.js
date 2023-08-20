import computeEmojiInformation from './preprocessing.js';
import pic2emoji from './pic2emoji.js';
import setupControls from './controls.js';


window.onload = async () => {
    let emojisInformation = localStorage.getItem('emojis');
    if (emojisInformation == null) {
        emojisInformation = await computeEmojiInformation();
    }
    emojisInformation = JSON.parse(emojisInformation);
    document.getElementById('preprocessing').style.display = 'none';
    pic2emoji(emojisInformation);
    setupControls();

}