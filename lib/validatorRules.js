'use strict'

const semver = require('semver')

module.exports = {
  osx: {
    versionCheck: 'sw_vers -productVersion',
    versionValidate:
            (detectedVersion, expectedVersion) => expectedVersion === detectedVersion.trim()
  },
  node: {
    versionCheck: 'node -v',
    versionValidate:
            (detectedVersion, expectedVersion) => semver.satisfies(detectedVersion, expectedVersion)
  },
  npm: {
    versionCheck: 'npm -v',
    versionValidate:
            (detectedVersion, expectedVersion) => semver.satisfies(detectedVersion, expectedVersion)
  },
  jx: {
    versionCheck: 'jx -jxv',
    versionValidate:
            (result, version) => 'v' + version === result.trim()
  },
  cordova: {
    versionCheck: 'cordova -v',
    versionValidate:
            (result, version) => version === result.trim()
  },
  appium: {
    versionCheck: 'appium -v',
    versionValidate:
            (result, version) => version === result.trim()
  },
  'ios-deploy': {
    versionCheck: 'ios-deploy -V',
    versionValidate:
            (result, version) => version === result.trim()
  },
  'ios-sim': {
    versionCheck: 'ios-sim --version',
    versionValidate:
            (result, version) => version === result.trim()
  },
  bower: {
    versionCheck: 'bower -v',
    versionValidate:
            (result, version) => semver.satisfies(result, version)
  },
  'ios-webkit-debug-proxy': {
    versionCheck: 'brew list ios-webkit-debug-proxy --versions',
    versionValidate:
            (result, version) => result.includes(version)

  },
  'ideviceinstaller': {
    versionCheck: 'brew list ideviceinstaller --versions',
    versionValidate:
            (result, version) => result.includes(version)
  },
  java: {
    versionCheck: 'javac -version 2>&1',
    versionValidate:
            (result, version) => result.includes(version)
  },
  ant: {
    versionCheck: 'ant -version',
    versionValidate:
            (result, version) => result.includes(version)
  },
  adb: {
    versionCheck: 'adb version',
    versionValidate:
            (result, version) => result.includes(version)
  },
  git: {
    versionCheck: 'git --version',
    versionValidate:
            (result, version) => {
              // http://stackoverflow.com/questions/82064/a-regex-for-version-number-parsing
              const found = result.match(/(\d+\.)?(\d+\.)?(\d+)/i)
              return found[0] === version
            }
  },
  windows: {
    versionCheck: 'ver',
    versionValidate:
            (result, version) => result.includes(version)
  },
  'gulp-cli': {
    versionCheck: 'npm list --depth=0 -g |grep gulp-cli',
    versionValidate:
            (result, version) => result.includes(version)
  },
  cocoapods: {
    versionCheck: 'pod --version',
    versionValidate:
            (result, version) => version === result.trim()
  },
  xcodebuild: {
    versionCheck: 'xcodebuild -version',
    versionValidate:
            (result, version) => result.includes(version)
  },
  carthage: {
    versionCheck: 'carthage version',
    versionValidate:
            (result, version) => version === result.trim()
  },
  xcpretty: {
    versionCheck: 'xcpretty -v',
    versionValidate:
            (result, version) => version === result.trim()
  },
  libimobiledevice: {
    versionCheck: 'brew list --versions |grep libimobiledevice',
    versionValidate:
            (result, version) => result.includes(version)
  },
  'deviceconsole': {
    versionCheck: 'npm list --depth=0 -g |grep deviceconsole',
    versionValidate:
            (result, version) => result.includes(version)
  },
  'check-engine': {
    versionCheck: 'npm list --depth=0 -g |grep check-engine',
    versionValidate:
            (result, version) => result.includes(version)
  },
  yarn: {
    versionCheck: 'yarn -v',
    versionValidate:
            (result, version) => semver.satisfies(result, version)
  },
  nsp: {
    versionCheck: 'nsp --version',
    versionValidate:
            (result, version) => version === result.trim()
  }
}
