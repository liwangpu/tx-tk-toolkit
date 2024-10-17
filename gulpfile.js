const { series, src, dest } = require("gulp");
const path = require('path');
const fs = require('fs');

const dist = path.join(__dirname, 'release', 'app', 'dist');
const rootPackageJsonPath = path.join(__dirname, 'package.json');
const releasePackageJsonPath = path.join(__dirname, 'release', 'app', 'package.json');

function upgradeAppVerion(packageJsonPath, version) {
  let str = fs.readFileSync(packageJsonPath, { encoding: 'utf-8' });
  let packageJson = JSON.parse(str);
  if (!version) {
    let appVersion = packageJson.version;
    let numberArr = appVersion.split('.');
    const lastNumberStr = numberArr[2];
    numberArr[2] = Number(lastNumberStr) + 1;
    version = numberArr.join('.');
  }
  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  return version;
}

function updateAppVersion(cb) {
  const version = upgradeAppVerion(rootPackageJsonPath);
  upgradeAppVerion(releasePackageJsonPath, version);
  cb();
}

exports.updateAppVersion = updateAppVersion;