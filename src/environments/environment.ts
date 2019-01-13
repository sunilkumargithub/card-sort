// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL: 'http://localhost',
  firebase: {
    apiKey: 'AIzaSyCXlPHgYkzoEwcdKUvC8eQX4oabi6x88yc',
    authDomain: 'doodhnath-100.firebaseapp.com',
    databaseURL: 'https://doodhnath-100.firebaseio.com',
    projectId: 'doodhnath-100',
    storageBucket: 'doodhnath-100.appspot.com',
    messagingSenderId: '53363004013'
  }
};

// <script src="https://www.gstatic.com/firebasejs/5.7.0/firebase.js"></script>
// <script>
//   // Initialize Firebase
//   var config = {
//     apiKey: "AIzaSyCXlPHgYkzoEwcdKUvC8eQX4oabi6x88yc",
//     authDomain: "doodhnath-100.firebaseapp.com",
//     databaseURL: "https://doodhnath-100.firebaseio.com",
//     projectId: "doodhnath-100",
//     storageBucket: "doodhnath-100.appspot.com",
//     messagingSenderId: "53363004013"
//   };
//   firebase.initializeApp(config);
// </script>
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

