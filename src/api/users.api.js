import sleep from '@fyclabs/tools-fyc-react/utils/sleep';

async function getUsers() {
  await sleep(1500);
  return {
    firstName: 'Justin',
    lastName: 'Fortier',
  };
}

export default {
  get: getUsers,
};
