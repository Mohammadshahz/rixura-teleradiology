// Lets the navbar's "Center" / "Radiologist" buttons pre-select the user type
// in the contact form, whether or not the form is mounted yet.
export type UserType = "Center" | "Radiologist";

const EVENT = "rixura:contact-intent";
let pending: UserType | null = null;

export const requestContact = (userType: UserType) => {
  pending = userType;
  window.dispatchEvent(new CustomEvent<UserType>(EVENT, { detail: userType }));
};

export const takePendingUserType = () => {
  const userType = pending;
  pending = null;
  return userType;
};

export const onContactIntent = (handler: (userType: UserType) => void) => {
  const listener = (e: Event) => {
    pending = null;
    handler((e as CustomEvent<UserType>).detail);
  };
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
};
