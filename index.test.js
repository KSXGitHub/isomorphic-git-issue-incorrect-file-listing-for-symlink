const { spawnSync } = require('child_process')
const fs = require('fs')
const isoGit = require('isomorphic-git')

it('isoGit.statusMatrix() is the same as git-status', async () => {
  const { error, status, stdout } = spawnSync('git', ['status', '--porcelain=v1'], {
    stdio: ['pipe', 'pipe', 'inherit'],
    encoding: 'utf8',
    cwd: __dirname,
  })
  if (error) throw error
  if (status) throw new Error(`Command 'git ls-files' exits with code ${status}`)
  const fromNativeGit = new Set(stdout.split('\n').filter(Boolean).map(line => line.slice(3)))

  const fromIsoGit = new Set(
    (await isoGit.statusMatrix({ fs, dir: __dirname }))
      .filter(([_, a, b, c]) => a !== 1 || b !== 1 || c !== 1) // filter changes
      .map(([filename]) => filename)
  )

  expect(fromIsoGit).toEqual(fromNativeGit)
})
