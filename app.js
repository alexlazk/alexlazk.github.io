// Lee parámetros ?pdf= &docId= &callback=
const qs   = new URLSearchParams(location.search);
const pdf  = qs.get('pdf');
const docId= qs.get('docId');
const cb   = qs.get('callback');

// Muestra el PDF usando el visor nativo de PDF.js
document.getElementById('viewer').src =
  `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdf)}`;

// Prepara el canvas de firma
const canvas = document.getElementById('sig-pad');
const sigPad = new SignaturePad(canvas, {penColor:'black'});

// Ajuste responsivo
function resize() {
  canvas.width  = canvas.clientWidth;
  canvas.height = 150;                 // altura fija
  sigPad.clear();
}
window.addEventListener('resize', resize);
resize();

// Botones
document.getElementById('clear').onclick = () => sigPad.clear();

document.getElementById('send').onclick = async () => {
  if (sigPad.isEmpty()) return alert('Falta la firma');

  const payload = {
    docId,
    signature: sigPad.toDataURL('image/png')
  };

  try {
    const r = await fetch(cb, {
      method : 'POST',
      headers: {'Content-Type':'application/json'},
      body   : JSON.stringify(payload)
    });
    if (!r.ok) throw new Error(r.statusText);
    alert('¡Firma enviada con éxito!');
    sigPad.clear();
  } catch (e) {
    alert('Error enviando la firma: ' + e.message);
  }
};
