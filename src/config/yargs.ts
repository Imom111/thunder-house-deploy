
import yargs from 'yargs/yargs';


const argv2 = yargs(process.argv.slice(2)).options({
  database: {
    alias: 'database',
    demandOption: false,
    default: false,
    describe: 'Do you want to generate database?',
    description: 'Database created',
    type: 'boolean',
  }
}).parseSync();


export default argv2;
