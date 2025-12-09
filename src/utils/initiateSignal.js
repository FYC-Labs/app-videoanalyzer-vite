export async function initiateSignal({ signal, fields = [] }) {
  try {
    signal.reset();
    signal.loadingStart();
    if (fields.length > 0) {
      const res = {};
      fields.forEach((val) => {
        if (val?.name) {
          res[val.name] = val.value;
        }
      });
      signal.update({
        ...signal.value,
        ...res,
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    signal.loadingEnd();
  }
}

export default initiateSignal;
