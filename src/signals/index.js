import { Signal } from '@fyclabs/tools-fyc-react/signals';

export const $global = Signal({
  isLoading: true,
  isSignedIn: false,
});
export const $view = Signal({});
export const $auth = Signal({});
export const $user = Signal({});
export const $list = Signal({});
export const $detail = Signal({});
export const $form = Signal({});
export const $filter = Signal({ page: 1 });
export const $alert = Signal({});
