import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// Structure suggérée pour le validateur de date
export function futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        // const inputDate = new Date(control.value);
        const today = new Date();

        const [year, month, day] = control.value.split('-').map(Number);
        // Attention, les mois en JS commencent à 0 (janvier = 0, juin = 5)
        const inputDate = new Date(year, month - 1, day);
        // Pensez à réinitialiser les heures pour comparer uniquement les dates
        today.setHours(0, 0, 0, 0);

        return inputDate > today ? { futureDate: true } : null;
    };
}