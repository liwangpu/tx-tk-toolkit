import tk_script from './tiktok';
import noco_script from './noco';


export function getTiktokScript(env?: any) {
  let content: string;
  const envStr: string = env
    ? `window._$$_toolkit_env=${JSON.stringify(env)};`
    : '';

  if (process.env.NODE_ENV === 'production') {
    const reg = new RegExp(`export default function startup`);
    content = `
    ${envStr}
    
    ${tk_script.toString().replace(reg, 'function startup')}
    
   startup();
      `;
  } else {
    content = `
    ${envStr}

    ${tk_script.toString()}
    
    ${tk_script.name}();`;
  }

  return content;
}

export function getNocoScript(){
  let content: string;

  if (process.env.NODE_ENV === 'production') {
    const reg = new RegExp(`export default function startup`);
    content = `

    ${noco_script.toString().replace(reg, 'function startup')}
    
   startup();
      `;
  } else {
    content = `

    ${noco_script.toString()}
    
    ${noco_script.name}();`;
  }

  return content;
}