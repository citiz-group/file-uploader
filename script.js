/*  INITIALIZATIONS
 */

let product = {};
let token = '';

/*  EVENT LISTENERS
 */

/*  Handles the event when one or multiple images are selected by the user and uploads them to a storage server.
 *    @param {Event} event - The event object representing the file selection event.
 */
window.addEventListener('LR_DATA_OUTPUT', event => {
  event.detail.data.forEach(output => {
    fetch(output.cdnUrl).then(r => r.blob()).then(image => {
      fetch('https://api.sirv.com/v2/files/upload?filename=%2F' + product.d74428a0196cace86d45a83a9526935ffe7b2415.substring(29).replace('/', '%2F') + event.detail.ctx + output.name, {
        body: image,
        headers: {
          'authorization': 'Bearer' + token,
          'content-type': output.mimeType
        },
        method: 'POST'
      }).then(_ => setTimeout(_ => location.reload(), 4000));
    });
  });
});

/*  FUNCTIONS
 */

/*  Deletes a file from a storage server based on the provided file URL.
 *    @param {string} fileUrl - The URL of the file to be deleted.
 */
const deleteFile = fileUrl => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce visuel ?')) {
    fetch('https://api.sirv.com/v2/files/delete?filename=%2F' + decodeURI(fileUrl).split('?')[0].substring(27, decodeURI(fileUrl).length).replace('/', '%2F'), {
      headers: {
        'authorization': 'Bearer' + token,
        'content-type': 'application/json'
      },
      method: 'POST'
    }).then(_ => setTimeout(_ => location.reload(), 4000));
  }
}

/*  Retrieves the response of the files associated with the given ID.
 *    @param {string} id - The ID of the files.
 *    @returns {Promise} - A promise that resolves with the response containing the files, or rejects with an error message.
 */
const getFiles = async id => {
  try {
    const SEARCH = await fetch('https://api.sirv.com/v2/files/search', {
      body: JSON.stringify({ "query": "dirname:\\/" + product.d74428a0196cace86d45a83a9526935ffe7b2415.substring(29) + id  + " AND -dirname:\\/.Trash" }),
      headers: {
        'authorization': 'Bearer' + token,
        'content-type': 'application/json'
      },
      method: 'POST'
    });
    return SEARCH.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

/*  Retrieves the URL of the image associated with the given ID.
 *    @param {string} id - The ID of the image.
 *    @returns {string|null} - The URL of the image, or null if no image is found for the provided ID.
 */
const getImageUrl = async id => {
  try {
    const SEARCH = await fetch('https://api.sirv.com/v2/files/search', {
      body: JSON.stringify({ "query": "dirname:\\/" + product.d74428a0196cace86d45a83a9526935ffe7b2415.substring(29) + id  + " AND -dirname:\\/.Trash" }),
      headers: {
        'authorization': 'Bearer' + token,
        'content-type': 'application/json'
      },
      method: 'POST'
    });
    const SEARCH_JSON = await SEARCH.json();
    return encodeURI('https://immocitiz.sirv.com/' + product.d74428a0196cace86d45a83a9526935ffe7b2415.substring(29) + id + '/' + SEARCH_JSON.hits[1]._source.basename + '?profile=visuel');
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

/*  MAIN
 */

fetch('https://api.sirv.com/v2/token', {
  body: JSON.stringify({
    "clientId": new URLSearchParams(window.location.search).get('s1'),
    "clientSecret": new URLSearchParams(window.location.search).get('s2')
  }),
  headers: { 'content-type': 'application/json' },
  method: 'POST'
}).then(r => r.json()).then(r => token = r.token);

fetch('https://immocitiz.pipedrive.com/api/v1/products/' + new URLSearchParams(window.location.search).get('id') + '?api_token=' + new URLSearchParams(window.location.search).get('p'))
  .then(r => r.json()).then(response => {
    product = response.data;

    $('#title').html(product.name);
    $('#subtitle').append('sourcé par ');
    $('#subtitle').append(product.d2c362a22b4628842cb19563a4fd19337b27189e ? product.d2c362a22b4628842cb19563a4fd19337b27189e.name : 'un chasseur inconnu');
    $('#subtitle').append(' le ' + new Date(product.add_time).toLocaleDateString('fr-FR'));

    getFiles('/Autre').then(hits => {
      hits?.hits.forEach((hit, i) => {
        if (!hit._source.isDirectory) {
          $('#Autre').append(
            '<div class="p-3 w-25">' +
              '<div class="card">' +
                '<img class="card-img-top" src="https://immocitiz.sirv.com' + hit._source.filename + '?profile=visuel">' +
                '<div class="align-items-center card-body d-flex flex-wrap justify-content-between">' +
                  '<p class="card-text mb-0">Autre<br>visuel n°' + i + '</p>' +
                  '<div class="btn-group">' +
                    '<a class="btn btn-outline-secondary" href="https://immocitiz.sirv.com' + hit._source.filename + '" target="_blank">' +
                      '<svg class="bi bi-search" fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">' +
                        '<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>' +
                      '</svg>' +
                    '</a>' +
                    '<button class="btn btn-outline-secondary" onclick="deleteFile(\'https://immocitiz.sirv.com' + encodeURI(hit._source.filename) + '\');" type="button">' +
                      '<svg class="bi bi-trash" fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">' +
                        '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>' +
                        '<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>' +
                      '</svg>' +
                    '</buton>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>'
          )
        }
      });
    });

    ['/Visuel 1', '/Visuel 2', '/Visuel 3', '/Visuel 4', '/Visuel 5', '/Visuel 6'].forEach(id => {
      getImageUrl(id).then(imageUrl => document.getElementById(id).innerHTML =
        '<div class="card">' +
          '<img class="card-img-top" src="' + imageUrl + '">' +
          '<div class="align-items-center card-body d-flex flex-wrap justify-content-between">' +
            '<p class="card-text mb-0">' + id.split('/')[id.split('/').length - 1].replace('Visuel ', 'Visuel n°') + '</p>' +
            '<div class="btn-group">' +
              '<a class="btn btn-outline-secondary" href="' + imageUrl + '" target="_blank">' +
                '<svg class="bi bi-search" fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">' +
                  '<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>' +
                '</svg>' +
              '</a>' +
              '<button class="btn btn-outline-secondary" onclick="deleteFile(\'' + encodeURI(imageUrl) + '\');" type="button">' +
                '<svg class="bi bi-trash" fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">' +
                  '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>' +
                  '<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>' +
                '</svg>' +
              '</buton>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    });
  });