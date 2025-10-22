// La funzione principale viene eseguita quando il DOM è completamente caricato
$(document).ready(function() {
    
    const form = document.forms['aereo_form'];
    
    // 1. Funzione per mostrare/nascondere l'area di testo 'note'
    function toggleNoteField() {
        // Accede agli elementi radio tramite il nome 'tipologia' e controlla quello selezionato
        const tipologiaSelezionata = form.elements['tipologia'].value;
        const noteContainer = $('#note_container');

        if (tipologiaSelezionata === 'M') {
            noteContainer.slideDown(); // Mostra con animazione
        } else {
            noteContainer.slideUp();   // Nasconde con animazione
            // Pulisce anche l'eventuale errore quando viene nascosto
            $('#err_note').text(''); 
        }
    }

    // Inizializza al caricamento della pagina (se 'Passeggeri' è preselezionato, sarà nascosto)
    toggleNoteField();

    // Associa l'evento change a tutti i radio button con name='tipologia'
    $('input[name="tipologia"]').on('change', toggleNoteField);

    // 2. Funzione di validazione del modulo
    function validateForm(event) {
        // Pulisce tutti i messaggi di errore precedenti
        $('.errore').text('');
        
        let isValid = true;

        // Recupera gli elementi tramite il loro nome
        const idCampo = form.elements['id'];
        const nomeCampo = form.elements['nome'];
        const tipologiaCampi = form.elements['tipologia']; // È un NodeList
        const noteCampo = form.elements['note'];
        
        // * Validazione 1: id non vuoto (essendo hidden e con valore 42, è sempre OK, ma controlliamo)
        if (idCampo.value.trim() === '') {
            $('#err_nome').text('Errore interno: ID aereo mancante.'); // Messaggio generico vicino al nome
            isValid = false;
        }

        // * Validazione 2: nome non vuoto
        if (nomeCampo.value.trim() === '') {
            $('#err_nome').text('Il nome dell\'aereo non può essere vuoto.');
            isValid = false;
        }

        // * Validazione 3: se è selezionata la tipologia 'Merci' (valore 'M'), 'note' deve avere almeno 10 caratteri
        const tipologiaValue = form.elements['tipologia'].value; // Ottiene il valore selezionato
        
        if (tipologiaValue === 'M') {
            if (noteCampo.value.trim().length < 10) {
                $('#err_note').text('Le note sono obbligatorie per la tipologia Merci e devono contenere almeno 10 caratteri.');
                isValid = false;
            }
        }

        if (!isValid) {
            event.preventDefault(); // Blocca l'invio del modulo
        }

        return isValid;
    }

    // 3. Associazione della funzione di validazione all'evento 'submit' del modulo
    form.addEventListener('submit', validateForm);
    
    // 4. Funzione per la richiesta AJAX
    $('#richiesta_ajax').on('click', function() {
        
        const idAereo = form.elements['id'].value.trim();
        const tipologiaAereo = form.elements['tipologia'].value;
        
        // Pulisce i vecchi messaggi di errore di 'note' e la risposta AJAX
        $('#err_note').text('');
        $('#risposta').remove(); // Rimuove il div 'risposta' se presente

        // Validazione AJAX: id non vuoto
        if (idAereo === '') {
            alert('Impossibile effettuare la richiesta AJAX: ID aereo mancante.');
            return;
        }
        
        // Creazione dei dati da inviare
        const dati = {
            id: idAereo,
            t: tipologiaAereo
        };
        
        // Richiesta POST asincrona
        $.ajax({
            url: 'note.php', 
            type: 'POST',
            data: dati,
            dataType: 'text', // Riceviamo come testo per la verifica successiva
            
            success: function(risposta) {
                // Tenta di convertire la risposta in intero
                const valoreIntero = parseInt(risposta, 10);
                
                // Controlla se il valore restituito è un intero (e non un NaN/float)
                if (!isNaN(valoreIntero) && String(valoreIntero) === risposta) {
                    // Se intero, mostralo in err_note
                    $('#err_note').text(`Valore intero restituito dal server: ${valoreIntero}`);
                } else {
                    // Se non intero, mostralo nell'elemento div con id "risposta"
                    let rispostaDiv = $('#risposta');
                    
                    // Se l'elemento div non esiste, crealo e aggiungilo in fondo alla pagina
                    if (rispostaDiv.length === 0) {
                        rispostaDiv = $('<div>').attr('id', 'risposta').css({
                            'border': '1px solid blue',
                            'padding': '10px',
                            'margin-top': '20px'
                        });
                        $('body').append(rispostaDiv);
                    }
                    
                    // Aggiorna il contenuto del div
                    rispostaDiv.html(`**Risposta AJAX non intera**:<br>${risposta}`);
                }
            },
            
            error: function(xhr, status, error) {
                // Se la richiesta non ha successo
                alert('Errore nella richiesta: ' + status);
            }
        });
    });
});