////QUERY
  let sidebar;
  let resultTable;
  let results;

  function query(queryString = 'table#searchResult tbody td') {
    console.log($(queryString));
    $('.eg_results_table').empty();
    return $(queryString);
  }

  function createQueryResultaTable() {
    let sidebar = $("<div/>");
    sidebar.addClass('eg_sidebar');
    $('body').append(sidebar);
    sidebar.css({
      'position': 'fixed',
      'width': '400px',
      'height': windowHeight,
      'min-height': '700px',
      'background': 'white',
      'overflow-y': 'scroll',
      'right': "-400px",
      'top': '0',
      'box-shadow': '0 0 10px 0 #000',
      'z-index': '9999'
    });
    let queryinput = $('<input type="text" placeholder="Insert your query here" class="query-input" style="width: 100%;padding: 10px; margin-bottom: 15px;"/>');
    sidebar.append(queryinput);
    queryinput.on('keyup', function(e) {
      if (e.keyCode == 13) {
        let queryString = queryinput.val();
        results = query(queryString);
        manageQueryResultTable(results);
      }
    });
    resultTable = $(`<table class="eg_results_table table table-bordered"></table>`);
    sidebar.append(resultTable);
    return resultTable;
  }

function manageQueryResultTable(results) {
    $.each(results, function(index, value) {
      // let name = $(value).find('.detName a').text();
      // let url = $(value).find('> a').first().attr('href');
      let tr = $('<tr/>');
      resultTable.append(tr);
      let tableRow = `<td>${index+1}</td><td>${value.outerHTML}</td>`;
      tr.append(tableRow);

    });
}

