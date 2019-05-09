
    // Needed for poly-filled browsers
    document.addEventListener('WebComponentsReady', function() {
      // Create a custom validator
      new Polymer.IronMeta({
        type: 'validator',
        key: 'year-2016-validator',
        value: {
          validate: function(value) {
            return new Date(value).getFullYear() === 2016;
          }
        }
      });
    });
  
    describe('using as a field in html form', function() {
      var datepicker;

      beforeEach(function() {
        datepicker = fixture('datepicker');
      });

      it('should have the given name', function() {
        datepicker.name = 'foo';
        expect(datepicker.$$('input').getAttribute('name')).to.equal('foo');
      });

      it('should have no name', function() {
        expect(datepicker.$$('input').getAttribute('name')).to.equal(null);
      });

      it('should be required', function() {
        datepicker.required = true;
        expect(datepicker.$$('input').getAttribute('required')).to.equal('');
      });

      it('should not be required', function() {
        expect(datepicker.$$('input').getAttribute('required')).to.equal(null);
      });

      it('should validate correctly', function() {
        datepicker.name = 'foo';
        datepicker.required = true;
        expect(datepicker.validate()).to.equal(false);
        expect(datepicker.invalid).to.be.equal(true);

        datepicker.value = '2016-02-24';
        expect(datepicker.validate()).to.equal(true);
        expect(datepicker.invalid).to.be.equal(false);
      });

      it('should validate correctly with custom validator', function() {
        // Use a custom validator registered with <iron-meta>.
        datepicker.validator = 'year-2016-validator';

        // Try invalid value.
        datepicker.value = '2014-01-01';
        expect(datepicker.validate()).to.equal(false);
        expect(datepicker.invalid).to.equal(true);

        // Try valid value.
        datepicker.value = '2016-01-01';
        expect(datepicker.validate()).to.equal(true);
        expect(datepicker.invalid).to.equal(false);
      });

      it('should validate correctly with auto-validate', function() {
        // Use a custom validator registered with <iron-meta>.
        datepicker.validator = 'year-2016-validator';
        datepicker.autoValidate = true;

        // Set invalid value.
        datepicker.value = '2014-01-01';
        expect(datepicker.invalid).to.be.true;

        // Change it to a valid value.
        datepicker.value = '2016-01-01';
        expect(datepicker.invalid).to.be.false;
      });

      it('should validate min/max dates', function() {
        datepicker.min = '2000-01-01';
        datepicker.max = '2001-01-01';

        // Set invalid value.
        datepicker.value = '2014-01-01';
        expect(datepicker.validate()).to.equal(false);
        expect(datepicker.invalid).to.be.equal(true);

        datepicker.value = '2000-02-01';
        expect(datepicker.validate()).to.equal(true);
        expect(datepicker.invalid).to.be.equal(false);
      });

      it('should be possible to force invalid status', function() {
        datepicker.invalid = true;
        expect(datepicker.$.inputcontainer.invalid).to.be.true;
      });

      it('should display the error-message when invalid', function(done) {
        datepicker.invalid = true;
        datepicker.errorMessage = 'Not cool';
        flush(function() {
          var error = datepicker.$$('paper-input-error');
          expect(error).not.to.equal(null);
          expect(error.textContent.trim()).to.equal(datepicker.errorMessage);
          done();
        });
      });

      it('should not display the error-message when undefined', function(done) {
        datepicker.invalid = true;
        flush(function() {
          var error = datepicker.$$('paper-input-error');
          expect(error).to.equal(null);
          done();
        });
      });

      it('should serialize correctly', function() {
        var form = fixture('datepicker-in-form', {name: 'foo'});
        datepicker = form.querySelector('vaadin-date-picker');
        datepicker.value = '2016-02-24';
        expect(form.serialize().foo).to.equal('2016-02-24');
      });

      it('should not-submit iron-form with invalid value', function() {
        var form = fixture('datepicker-in-form', {name: 'foo', required: true});
        var spy = sinon.spy();
        form.addEventListener('iron-form-invalid', spy);
        form.submit();
        expect(spy).to.have.been.called;
      });

      it('should show error indicator', function() {
        var form = fixture('datepicker-in-form', {name: 'foo', required: true});
        form.submit();
        var undeline = form.querySelector('vaadin-date-picker').$.inputcontainer.$$('.underline');
        expect(undeline.getAttribute('class')).to.contain('is-invalid');
      });

      it('should have disabled paper-input-container', function() {
        datepicker.disabled = true;
        expect(datepicker.$.inputcontainer.getAttribute('disabled')).to.equal('');
        expect(datepicker.$.input.disabled).to.equal(true);
      });

      it('should validate keyboard input (invalid)', function(done) {
        var input = datepicker.$.input;
        input.value = 'foo';
        input.fire('input');

        datepicker.addEventListener('iron-overlay-closed', function() {
          expect(datepicker.validate()).to.equal(false);
          expect(datepicker.invalid).to.be.equal(true);
          done();
        });
        datepicker.close();
      });

      it('should validate keyboard input (valid)', function(done) {
        var input = datepicker.$.input;
        input.value = '01/01/2000';
        input.fire('input');

        datepicker.addEventListener('iron-overlay-closed', function() {
          expect(datepicker.validate()).to.equal(true);
          expect(datepicker.invalid).to.be.equal(false);
          done();
        });
        datepicker.close();
      });

      it('should validate keyboard input (disallowed value)', function(done) {
        var input = datepicker.$.input;
        datepicker.min = '2001-01-01';
        input.value = '01/01/2000';
        input.fire('input');

        datepicker.addEventListener('iron-overlay-closed', function() {
          expect(datepicker.validate()).to.equal(false);
          expect(datepicker.invalid).to.be.equal(true);
          done();
        });
        datepicker.close();
      });

    });
  