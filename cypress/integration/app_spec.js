const dummy = {
  name: 'Anup Sedhain',
  email: 'npsedhain@gmail.com',
  age: 23,
  phoneNumber: 988923434,
  password: '@##!12132DdsFDSFSads@#@1$%$',
  homepage: 'https://google.com'
};

const dummy2 = {
  name: 'Random Guy',
  email: 'random@gmail.com',
  age: 25,
  phoneNumber: 988923423,
  password: '@##!12132DdsFDSFSads@#@1$%$DIFF12',
  homepage: 'https://google.com'
};

describe('Sign Up', () => {
  it('Adds a couple of people to the list', () => {
    cy.visit('/');
    cy.contains('Sign Up');

    // type the form details
    cy.get('[name="name"]').type(dummy.name);
    cy.get('[name="email"]').type(dummy.email);
    cy.get('[name="age"]').type(dummy.age);
    cy.get('[name="phoneNumber"]').type(dummy.phoneNumber);
    cy.get('[name="password"]').type(dummy.password);
    cy.get('[name="homepage"]').type(dummy.homepage);

    cy.get('form').submit();

    // wait for submission to complete
    cy.get('tbody').contains(dummy.name);

    // type the form details for second user
    cy.get('[name="name"]').type(dummy2.name);
    cy.get('[name="email"]').type(dummy2.email);
    cy.get('[name="age"]').type(dummy2.age);
    cy.get('[name="phoneNumber"]').type(dummy2.phoneNumber);
    cy.get('[name="password"]').type(dummy2.password);
    cy.get('[name="homepage"]').type(dummy2.homepage);

    cy.get('form').submit();

    // make sure all the right values are added to the table finally
    const tbody = cy.get('tbody');
    tbody.should('contain', dummy.name);
    tbody.should('contain', dummy.email);
    tbody.should('contain', dummy.age);
    tbody.should('contain', dummy.phoneNumber);
    tbody.should('contain', dummy.homepage);
    tbody.should('contain', dummy2.name);
    tbody.should('contain', dummy2.email);
    tbody.should('contain', dummy2.age);
    tbody.should('contain', dummy2.phoneNumber);
    tbody.should('contain', dummy2.homepage);
  });

  it('Submit button should be disabled when form is empty', () => {
    cy.visit('/');

    cy.get('input[type="submit"]').should('be.disabled');
  });

  it('Submit button should change statuses as expected when an action is performed', () => {
    cy.visit('/');

    cy.get('[name="name"]').type(dummy.name);
    cy.get('[name="email"]').type(dummy.email);
    cy.get('[name="age"]').type(dummy.age);
    cy.get('[name="phoneNumber"]').type(dummy.phoneNumber);
    cy.get('[name="password"]').type(dummy.password);
    cy.get('[name="homepage"]').type(dummy.homepage);

    const submitButton = cy.get('input[type="submit"]');
    submitButton.click().then(() => {
      submitButton.contains('Saving...').then(() => {
        submitButton.contains('Saved!');
      });
    });
  });

  it('Check if the in line validation works', () => {
    cy.visit('/');

    cy.get('[name="name"]').focus();
    cy.get('[name="email"]').type('npsedhain');
    cy.get('[name="age"]').type('string');
    cy.get('[name="phoneNumber"]').type(9);
    cy.get('[name="password"]').type('123');
    cy.get('[name="homepage"]').type('something').blur();

    cy.contains('Name Required');
    cy.contains('Invalid Email');
    cy.contains('Invalid Age');
    cy.contains('Invalid Phone Number');
    cy.contains('Weak Password');
    cy.contains('Invalid URL');
  });

  it('Check if  validation is updated realtime', () => {
    cy.visit('/');

    // check if name field validation is updated realtime
    cy.get('[name="name"]').focus().blur();
    cy.contains('Name Required');
    cy.get('[name="name"]').type('Beautiful Name');
    cy.get('.red.mt2').should('not.be.visible');

    // check if email field validation is updated realtime
    cy.get('[name="email"]').focus().blur();
    cy.contains('Invalid Email');
    cy.get('[name="email"]').type(dummy.email);
    cy.get('.red.mt2').should('not.be.visible');

    // check if age field validation is updated realtime
    cy.get('[name="age"]').focus().blur();
    cy.contains('Invalid Age');
    cy.get('[name="age"]').type(223);
    cy.contains('Invalid Age');
    cy.get('[name="age"]').clear();
    cy.get('[name="age"]').type(23);
    cy.get('.red.mt2').should('not.be.visible');

    // check if phone number field validation is updated realtime
    cy.get('[name="phoneNumber"]').focus().blur();
    cy.contains('Invalid Phone Number');
    cy.get('[name="phoneNumber"]').type('12');
    cy.contains('Invalid Phone Number');
    cy.get('[name="phoneNumber"]').clear();
    cy.get('[name="phoneNumber"]').type(123223231);
    cy.get('.red.mt2').should('not.be.visible');

    // check if email field validation is updated realtime
    cy.get('[name="password"]').type('simple').blur();
    cy.contains('Weak Password');
    cy.get('[name="password"]').clear();
    cy.get('[name="password"]').type('12345simple');
    cy.contains('Weak Password');
    cy.get('[name="password"]').clear();
    cy.get('[name="password"]').type('fdsjkfn*&*&*(JBJBJHB12321389uKJNDJ');
    cy.get('.red.mt2').should('not.be.visible');

    // check if email field validation is updated realtime
    cy.get('[name="homepage"]').type('not a url').blur();
    cy.contains('Invalid URL');
    cy.get('[name="homepage"]').clear();
    cy.get('[name="homepage"]').type(dummy.homepage).blur();
    cy.get('.red.mt2').should('not.be.visible');
  });

  it('Make sure the correct user is saved to local storage and the correct url is requested', () => {
    cy.visit('/');

    cy.get('[name="name"]').type(dummy.name);
    cy.get('[name="email"]').type(dummy.email);
    cy.get('[name="age"]').type(dummy.age);
    cy.get('[name="phoneNumber"]').type(dummy.phoneNumber);
    cy.get('[name="password"]').type(dummy.password);
    cy.get('[name="homepage"]').type(dummy.homepage);

    const people = [
      {
        name: 'Anup Sedhain',
        email: 'npsedhain@gmail.com',
        age: '23',
        phoneNumber: '988923434',
        password: '@##!12132DdsFDSFSads@#@1$%$',
        homepage: 'https://google.com'
      }
    ];

    const submitButton = cy.get('input[type="submit"]');
    submitButton.click().then(() => {
      submitButton.contains('Saved!').then(() => {
        expect(localStorage.getItem('people')).to.eq(JSON.stringify(people));
      });

      const tbody = cy.get('tbody');
      tbody.get('a[href="https://google.com"]').then(($location) => {
        const href = $location.prop('href');
        cy.request(href).its('body').should('contain', 'Google');
      });
    });
  });

  it('Check if the weak password validation is robust', () => {
    const ensureNotValid = () => {
      cy.contains('Weak Password');
      cy.get('input[type="submit"]').should('be.disabled');
    };

    cy.visit('/');

    // try with simple alphabets
    cy.get('[name="password"]').type('abcdefghijklmnop').blur();
    ensureNotValid();

    // try with numbers only
    cy.get('[name="password"]').focus().clear().type('1234567890').blur();
    ensureNotValid();

    // try with numbers and alphabets only
    cy.get('[name="password"]').focus().clear().type('1234567890abcdefghijkl').blur();
    ensureNotValid();

    // try with numbers and alphabets and special chars
    cy.get('[name="password"]').focus().clear().type('1234567890abcdefghijkl#@%$%^&%^&^').blur();
    ensureNotValid();

    // test with a valid password but form submit is still disabled
    cy.get('[name="password"]').focus().clear().type('@##!12132DdsFDSFSads@#@1$%$').blur();
    cy.get('.red.mt2').should('not.be.visible');
    cy.get('input[type="submit"]').should('be.disabled');
  });

  it('Check if any one field left empty still disables the submit button', () => {
    cy.visit('/');

    const clearFields = () => {
      cy.get('[name="name"]').clear();
      cy.get('[name="email"]').clear();
      cy.get('[name="age"]').clear();
      cy.get('[name="phoneNumber"]').clear();
      cy.get('[name="password"]').clear();
      cy.get('[name="homepage"]').clear();
    };

    // leave out name
    cy.get('[name="email"]').type(dummy.email);
    cy.get('[name="age"]').type(dummy.age);
    cy.get('[name="phoneNumber"]').type(dummy.phoneNumber);
    cy.get('[name="password"]').type(dummy.password);
    cy.get('[name="homepage"]').type(dummy.homepage).blur();
    cy.get('input[type="submit"]').should('be.disabled');

    clearFields();

    // leave out email
    cy.get('[name="name"]').type(dummy.name);
    cy.get('[name="age"]').type(dummy.age);
    cy.get('[name="phoneNumber"]').type(dummy.phoneNumber);
    cy.get('[name="password"]').type(dummy.password);
    cy.get('[name="homepage"]').type(dummy.homepage).blur();
    cy.get('input[type="submit"]').should('be.disabled');

    clearFields();

    // leave out age
    cy.get('[name="name"]').type(dummy.name);
    cy.get('[name="email"]').type(dummy.email);
    cy.get('[name="phoneNumber"]').type(dummy.phoneNumber);
    cy.get('[name="password"]').type(dummy.password);
    cy.get('[name="homepage"]').type(dummy.homepage).blur();
    cy.get('input[type="submit"]').should('be.disabled');

    clearFields();

    // leave out phone number
    cy.get('[name="name"]').type(dummy.name);
    cy.get('[name="email"]').type(dummy.email);
    cy.get('[name="age"]').type(dummy.age);
    cy.get('[name="password"]').type(dummy.password);
    cy.get('[name="homepage"]').type(dummy.homepage).blur();
    cy.get('input[type="submit"]').should('be.disabled');

    clearFields();

    // leave out password
    cy.get('[name="name"]').type(dummy.name);
    cy.get('[name="email"]').type(dummy.email);
    cy.get('[name="age"]').type(dummy.age);
    cy.get('[name="phoneNumber"]').type(dummy.phoneNumber);
    cy.get('[name="homepage"]').type(dummy.homepage).blur();
    cy.get('input[type="submit"]').should('be.disabled');

    clearFields();

    // leave out home page
    cy.get('[name="name"]').type(dummy.name);
    cy.get('[name="email"]').type(dummy.email);
    cy.get('[name="age"]').type(dummy.age);
    cy.get('[name="phoneNumber"]').type(dummy.phoneNumber);
    cy.get('[name="password"]').type(dummy.password).blur();
    cy.get('input[type="submit"]').should('be.disabled');
  });

  it('Make sure that correct person from local storage is loaded on component mount', () => {
    localStorage.setItem('people', JSON.stringify([dummy]));

    cy.visit('/');

    cy.contains(dummy.name);
    cy.contains(dummy.email);
    cy.contains(dummy.age);
    cy.contains(dummy.phoneNumber);
    cy.contains(dummy.homepage);
  });
});
