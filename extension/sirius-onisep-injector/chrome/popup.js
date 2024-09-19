
const slugify = (str) => {
  return String(str)
    .normalize('NFKD')
    .replaceAll('\'', '-')
    .replaceAll('/', '-')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://sirius.inserjeunes.beta.gouv.fr/api/formations/temoignage-count',{
    method: 'GET',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    }} )
    .then(response => response.json())
    .then(data => {
      console.log({data})
      const formationLink = document.getElementById('formation-link');
      data.forEach(item => {
        console.log({item})
        if(item.temoignagesCount < 1) return;
        if(item.onisepIntitule === null) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.innerText = item.onisepIntitule.replace('bac pro', "BAC Pro");
        a.href = `https://www.onisep.fr/ressources/univers-formation/formations/lycees/${slugify(item.onisepIntitule)}`;
        a.target = "_blank";
        li.appendChild(a);
        
        const b = document.createElement('b');
        b.innerText = ` (${item.temoignagesCount})`;
        li.appendChild(b);
        
        formationLink.appendChild(li);
      });
    })
    .catch(error => {
      const errorContainer = document.getElementById('formation-error');
      const errorText = document.getElementById('formation-error-text');
      errorContainer.style.display = 'block';
      errorText.innerText = error;
    });

  fetch('https://sirius.inserjeunes.beta.gouv.fr/api/etablissements/temoignage-count',{
    method: 'GET',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    }} )
    .then(response => response.json())
    .then(data => {
      const etablissementLink = document.getElementById('etablissement-link');
      data.forEach(item => {
        if(item.temoignagesCount < 1) return;
        if(item.onisepUrl === null) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.innerText = item.onisepNom || item.enseigne || item.entrepriseRaisonSociale;
        a.href = `https://${item.onisepUrl}`;
        a.target = "_blank";
        li.appendChild(a);
        
        const b = document.createElement('b');
        b.innerText = ` (${item.temoignagesCount})`;
        li.appendChild(b);
        
        etablissementLink.appendChild(li);
      });
    })
    .catch(error => {
      const errorContainer = document.getElementById('etablissement-error');
      const errorText = document.getElementById('etablissement-error-text');
      errorContainer.style.display = 'block';
      errorText.innerText = error;
    });
});
