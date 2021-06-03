import {SweetAlertOptions} from 'sweetalert2';

export class SwalUtils {
  public static successOptions(text?: string): SweetAlertOptions {
    return {icon: 'success', title: 'Succès', text};
  }

  public static infoOptions(text?: string): SweetAlertOptions {
    return {icon: 'info', title: 'Information', text};
  }

  public static errorOptions(text?: string): SweetAlertOptions {
    return {icon: 'error', title: 'Erreur', text};
  }
}
