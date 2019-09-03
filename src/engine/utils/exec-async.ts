import util from 'util';
import { exec } from 'child_process';

const execAsync = util.promisify(exec);

export default execAsync;
