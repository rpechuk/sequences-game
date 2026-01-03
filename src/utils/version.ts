import versionData from '../../version.json?raw';

const version = JSON.parse(versionData);

export const getVersion = () => version.version;
export const getBuildHash = () => version.buildHash;
export const getFullVersion = () => `v${version.version} • #${version.buildHash}`;
