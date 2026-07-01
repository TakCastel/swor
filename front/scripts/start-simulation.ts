import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const MIN_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_INTERVAL = 30 * 60 * 1000; // 30 minutes

async function runSimulation() {
  const args = process.argv.slice(2);
  const countFlag = args.includes('--count') ? `--count ${args[args.indexOf('--count') + 1]}` : '';
  const allFlag = args.includes('--all-members') ? '--all-members' : '';
  
  console.log(`[${new Date().toISOString()}] Lancement d'une interaction...`);
  try {
    const { stdout, stderr } = await execAsync(`npm run simulate -- ${countFlag} ${allFlag}`);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error('Erreur lors de la simulation:', error);
  }

  // Planifier la prochaine exécution
  const nextInterval = Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1)) + MIN_INTERVAL;
  console.log(`Prochaine interaction dans ${Math.round(nextInterval / 60000)} minutes.`);
  setTimeout(runSimulation, nextInterval);
}

console.log('--- Démon de simulation RP Star Wars démarré ---');
runSimulation();

