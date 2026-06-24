const { spawn } = require('child_process')

const isWindows = process.platform === 'win32'
const npm = isWindows ? 'npm.cmd' : 'npm'

const commands = [
  ['server', npm, ['run', 'server:dev']],
  ['client', npm, ['run', 'client:dev']],
]

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: false,
  })

  child.on('exit', (code, signal) => {
    if (code || signal) {
      console.log(`${name} exited with ${signal || code}`)
      shutdown(code || 1)
    }
  })

  return child
})

let shuttingDown = false

function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true

  for (const child of children) {
    if (!child.killed) child.kill()
  }

  process.exit(code)
}

process.on('SIGINT', () => shutdown())
process.on('SIGTERM', () => shutdown())
