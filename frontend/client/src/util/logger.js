// This is where all colorful loggers are defined

export function reduxVoid  (string) {
    console.log('%c[Redux] '+string, 'background: #34568B; color: #EFC050')
}

export function logVoid (string) {
    console.log('%c '+string, 'background: #222; color: #bada55')
}

