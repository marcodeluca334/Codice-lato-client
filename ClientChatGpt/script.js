document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('modulo_aereo');
  const tipologiaP = document.getElementById('tipologiaP');
  const tipologiaM = document.getElementById('tipologiaM');
  const boxNote = document.getElementById('box_note');
  const ajaxBtn = document.getElementById('ajax_btn');

  // Mostra/nascondi campo note
  tipologiaP.addEventListener('change', toggleNote);
  tipologiaM.addEventListener('change', toggleNote);

  function toggleNote() {
    if (tipologiaM.checked) {
      boxNote.classList.remove('nascosto');
    } else {
      boxNote.classList.add('nascosto');
    }
  }

  // Validazione
  form.addEventListener('submit', (e) => {
    let valido = true;

    // Pulizia messaggi errore
    document.getElementById('err_nome').textContent = '';
    document.getElementById('err_tipologia').textContent = '';
    document.getElementById('err_note').textContent = '';

    const id = form.elements['id'].value.trim();
    const nome = form.elements['nome'].value.trim();
    const tipologia = form.elements['tipologia'].value;
    const note = form.elements['note'].value.trim();

    if (id === '') {
      alert('ID non può essere vuoto');
      valido = false;
    }

    if (nome === '') {
      document.getElementById('err_nome').textContent = 'Il nome è obbligatorio';
      valido = false;
    }

    if (tipologia === 'M' && note.length < 10) {
      document.getElementById('err_note').textContent = 'Inserisci almeno 10 caratteri';
      valido = false;
    }

    if (!valido) e.preventDefault();
  });

  // Invio AJAX
  ajaxBtn.addEventListener('click', () => {
    const id = form.elements['id'].value.trim();
    const tipologia = form.elements['tipologia'].value;

    if (id === '') {
      alert('ID mancante, impossibile inviare la richiesta AJAX.');
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'note.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
      if (xhr.status === 200) {
        const risposta = xhr.responseText.trim();

        // Se è un intero -> mostra in err_note
        if (/^-?\d+$/.test(risposta)) {
          document.getElementById('err_note').textContent = risposta;
        } else {
          let divRisposta = document.getElementById('risposta');
          if (!divRisposta) {
            divRisposta = document.createElement('div');
            divRisposta.id = 'risposta';
            document.body.appendChild(divRisposta);
          }
          divRisposta.textContent = risposta;
        }
      } else {
        alert('Errore nella richiesta');
      }
    };

    xhr.onerror = function() {
      alert('Errore nella richiesta');
    };

    const params = `id=${encodeURIComponent(id)}&t=${encodeURIComponent(tipologia)}`;
    xhr.send(params);
  });
});
