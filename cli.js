import fs from 'fs';

const args = process.argv.slice(2);

const knownFlags = ['--help', '-h', '--version', '-v']

// Check for help flag
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: readme-stats [options] [path]

Arguments:
  path           Path to README.md file (default: ./README.md)

Options:
  --help, -h     Show help information
  --version, -v  Show version number
`);
    process.exit(0);
};

// Check for version flag
if (args.includes('--version') || args.includes('-v')) {
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    console.log(`readme-stats version ${pkg.version}`);
    process.exit(0);
};

// Filter out flags, take first remaining arg or default
const positionalArgs = args.filter(arg => !arg.startsWith('-'));
const readmePath = positionalArgs[0] || './README.md';

// Check for unknown flags
const unknownFlags = args.filter(arg => arg.startsWith('-'));

if (unknownFlags.length > 0) {
  console.error(`Error: Unknown option '${unknownFlags[0]}'`);
  console.error('Run "readme-stats --help" for usage information');
  process.exit(1);
};

// Check for too many positional args
if (positionalArgs.length > 1) {
  console.error('Error: Too many arguments');
  console.error('Run "readme-stats --help" for usage information');
  process.exit(1);
};

if (!fs.existsSync(readmePath)) {
  console.error(`Error: File not found ${readmePath}`);
  process.exit(1);
};