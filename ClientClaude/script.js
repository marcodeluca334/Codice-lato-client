// Gestione visibilità campo note
const radioButtons = document.querySelectorAll('input[name="tipologia"]');
const noteGroup = document.getElementById('noteGroup');

radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'M') {
            noteGroup.classList.remove('hidden');
        } else {
            noteGroup.classList.add('hidden');
        }
    });
});

// Funzione di validazione
function validaForm(e) {
    e.preventDefault();
    
    // Pulisci messaggi di errore precedenti
    document.getElementById('err_nome').textContent = '';
    document.getElementById('err_note').textContent = '';
    
    let valido = true;
    const form = document.forms['formAereo'];
    
    // Validazione id
    const id = form.elements['id'].value.trim();
    if (id === '') {
        valido = false;
    }
    
    // Validazione nome
    const nome = form.elements['nome'].value.trim();
    if (nome === '') {
        document.getElementById('err_nome').textContent = 'Il nome è obbligatorio';
        valido = false;
    }
    
    // Validazione tipologia e note
    const tipologia = form.elements['tipologia'].value;
    if (tipologia === 'M') {
        const note = form.elements['note'].value.trim();
        if (note.length < 10) {
            document.getElementById('err_note').textContent = 'Le note devono contenere almeno 10 caratteri';
            valido = false;
        }
    }
    
    // Se la validazione è passata, invia il form
    if (valido) {
        form.submit();
    }
}

// Associa la funzione di validazione all'evento submit
document.forms['formAereo'].addEventListener('submit', validaForm);

// Gestione richiesta AJAX
document.getElementById('btn_ajax').addEventListener('click', function() {
    const form = document.forms['formAereo'];
    const id = form.elements['id'].value.trim();
    
    // Validazione: id deve essere non vuoto
    if (id === '') {
        alert('ID non può essere vuoto');
        return;
    }
    
    const tipologia = form.elements['tipologia'].value;
    
    // Crea l'oggetto XMLHttpRequest
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const risposta = xhr.responseText.trim();
                
                // Verifica se è un numero intero
                if (/^\d+$/.test(risposta)) {
                    // Valore intero: mostra in err_note
                    document.getElementById('err_note').textContent = risposta;
                } else {
                    // Valore non intero: mostra in div risposta
                    let divRisposta = document.getElementById('risposta');
                    
                    // Crea il div se non esiste
                    if (!divRisposta) {
                        divRisposta = document.createElement('div');
                        divRisposta.id = 'risposta';
                        document.body.appendChild(divRisposta);
                    }
                    
                    divRisposta.textContent = risposta;
                }
            } else {
                // Richiesta non riuscita
                alert('Errore nella richiesta');
            }
        }
    };
    
    // Prepara i parametri POST
    const params = 'id=' + encodeURIComponent(id) + '&t=' + encodeURIComponent(tipologia);
    
    xhr.open('POST', 'note.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
});