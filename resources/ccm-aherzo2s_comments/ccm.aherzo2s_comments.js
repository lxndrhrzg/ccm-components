ccm.component( {
  name: 'aherzo2s_comments',
  config: {
    html:  [ ccm.store, { local: 'templates.json' } ],
    key:   'randomkey',
    store: [ ccm.store, { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'aherzo2s_comments' } ],
    style: [ ccm.load, 'ccm-style.css' ],  // Einbindung einer CSS-Datei
    user:  [ ccm.instance, 'http://kaul.inf.h-brs.de/ccm/components/user2.js' ]
  },
  onsubmit: function () {
    var value = ccm.helper.val( ccm.helper.find( self, 'input' ).val().trim() );
    if ( value === '' ) return;
    self.user.login( function () {  // Nutzung der user-Instanz für Authentifizierung
      dataset.messages.push( { user: self.user.data().key, date: new Date(), text: value } );
      self.store.set( dataset, function () { self.render(); } );
    } );
    return false;
  },
  Instance: function () {
	var self = this;
    self.render = function ( callback ) {
      var element = ccm.helper.element( self );
	  self.store.get( self.key, function ( dataset ) {
		  if ( dataset === null )
			  self.store.set( { key: self.key, messages: [] }, proceed );
		  else
			  proceed( dataset );
		  function proceed( dataset ) {
			  element.html( ccm.helper.html( self.html.get( 'main' ) ) );
			  var messages_div = ccm.helper.find( self, '.messages' );     // neue private Variable
			  for ( var i = 0; i < dataset.messages.length; i++ ) {
				  var message = dataset.messages[ i ];
				  messages_div.append( ccm.helper.html( self.html.get( 'message' ), {
					name: ccm.helper.val( message.user ),  // Herausfiltern von Skripten, falls
					date: ccm.helper.val( message.date ),
					text: ccm.helper.val( message.text )   // der Datensatz manipuliert ist.
				  } ) );
			  }
			  element.append( ccm.helper.html( self.html.get( 'input' ), {  // Anhängen der Sendeleiste
				onsubmit: function () {
					var value = ccm.helper.val( ccm.helper.find( self, 'textarea' ).val().trim() );
					if ( value === '' ) return;
					self.user.login( function () {  // Nutzung der user-Instanz für Authentifizierung
						dataset.messages.push( { user: self.user.data().key, date: new Date(), text: value } );
						self.store.set( dataset, function () { self.render(); } );
					} );
				  return false;                                               // Datenspeicher/Datenbank
				}                                   // input-Templates
			  } ) );
			  if ( callback ) callback();
		  }
	  } );
    }
	self.init = function ( callback ) {
	  self.store.onChange = function () { self.render(); };
	  callback();
	};
  }
} );

