import ancient from '../../images/ancient.png';
import baby from '../../images/baby.png';
import crabs from '../../images/crabs.png';
import elf from '../../images/elf.png';
import geek from '../../images/geek.png';
import goblin from '../../images/goblin.png';
import goose from '../../images/goose.png';
import krisotka from '../../images/krisotka.png';
import munchkin from '../../images/munchkin.png';
import thief from '../../images/thief.png';
import troll from '../../images/troll.png';
import warrior from '../../images/warrior.png';
import boromir from '../../images/boromir.jpg';
import frodo from '../../images/frodo.jpg';
import gendalf from '../../images/gendalf.jpg';
import gollum from '../../images/gollum.jpg';

const imagesPathsArr = [ancient, baby, crabs, elf, geek, goblin, goose, krisotka, munchkin, thief, troll, warrior, boromir, frodo, gendalf, gollum];

let getRandomPath = imagesPathsArr[Math.floor(Math.random() * imagesPathsArr.length)];

export {getRandomPath}
export default imagesPathsArr;