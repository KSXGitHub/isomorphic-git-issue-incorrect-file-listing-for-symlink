const { spawnSync } = require('child_process')
const fs = require('fs')
const isoGit = require('isomorphic-git')

it('isoGit.listFiles() is the same as git-ls-files', async () => {
  const { error, status, stdout } = spawnSync('git', ['ls-files'], {
    stdio: ['pipe', 'pipe', 'inherit'],
    encoding: 'utf8',
    cwd: __dirname,
  })
  if (error) throw error
  if (status) throw new Error(`Command 'git ls-files' exits with code ${status}`)
  const fromNativeGit = new Set(stdout.split('\n').filter(Boolean))

  const fromIsoGit = new Set(await isoGit.listFiles({
    fs,
    dir: __dirname,
  }))

  expect(fromIsoGit).toEqual(fromNativeGit)
})
