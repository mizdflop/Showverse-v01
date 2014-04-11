SinglePageLogin.config({
      loginTitle: 'Single page login',
      signupTitle: 'Single page sign up',
      forgotPasswordTitle: 'Retrieve password',
      canRetrievePassword: true,
      passwordSignupFields: 'USERNAME_AND_EMAIL',
      forbidClientAccountCreation: false,
      routeAfterLogin: '/select_episode/group/nattercast',
      routeAfterSignUp: '/addphoto',
      forceLogin: true,
  });