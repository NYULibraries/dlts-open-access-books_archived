YUI().use(
    'node'
  , 'event'
  , 'io'
  , 'node-scroll-info'
  , 'handlebars'
  , 'json-parse'
  , 'jsonp'
  , 'jsonp-url'  
  , 'gallery-idletimer'
  , function (Y) {

    'use strict'
    
    var datasourceURL = 'http://dev-discovery.dlib.nyu.edu:8080/solr3_discovery/nyupress/select?&wt=json&json.wrf=callback={callback}&hl=true&hl.fl=title,description,text&fl=title,description,author,identifier,coverHref'
      , body = Y.one('body')
      , container = Y.one('#a')
      , query = Y.one('.query')
      , loadMoreButton = Y.one('.pure-button.loading')
      , searchString = '*:*'
      , transactions = []
      , href
      , pager = Y.one('ul.pure-paginator')
      , fold = 200
      , source   = Y.one('#list-template').getHTML()
      , template = Y.Handlebars.compile(source)
      
    function onFailure() {
        Y.log('onFailure')
        // Y.io('../404.html', { on : { success : function(transactionid, response) { container.append(response.response) } } } )
    }
    
    function onTimeout() {
        onFailure()
    }

    function onClick(e) {
        e.preventDefault()
        onScroll()
    }
    
    function onPaginatorAvailable() {
        if (this.get('region').top - fold < body.get('winHeight')) onScroll()
    }

    function onSubmit(e) {
        
        e.preventDefault()
        
        var currentTarget = e.currentTarget
          , value = Y.one('.pure-input')
        
        location.href = currentTarget.get('action') + '/' + value.get('value')
    }    
    
    function onScroll(e) {
    
        if (body.hasClass('io-done')) return
        
        var numfound = parseInt(container.getAttribute("data-numfound"), 10)
          , start = parseInt(container.getAttribute("data-start"), 10)
          , docslength = parseInt(container.getAttribute("data-docslength"), 10)

        if (
          start + docslength <= numfound
        ) {
            
            href = datasourceURL + '&start=' + ( start + docslength )
            
	        if (Y.Array.indexOf(transactions, href) < 0 && !body.hasClass('io-loading')) {
                
                if (
                    body.scrollInfo.getScrollInfo().atBottom ||
                    (
                        Y.IdleTimer.isIdle() && pager.get('region').top - fold < body.get('winHeight')
                    )
                ) {
                  
                  body.addClass('io-loading')
                  
                  loadMoreButton.addClass('pure-button-disabled')
                  
                  Y.jsonp(href, {
                    on: {
                      success: onSuccess,
                      failure: onFailure,
                      timeout: onTimeout
                    },
                    timeout: 3000
                  })

                }
            }

        }
        
    }

    function onSuccess(response) {
    
        try {
        
            var numfound = parseInt(response.response.numFound, 10)
              , start = parseInt(response.response.start, 10)
              , docslength = parseInt(response.response.docs.length, 10)        
        
             // store called to avoid making the request multiple times
             transactions.push(this.url)

             container.setAttribute("data-numFound", numfound)

             container.setAttribute("data-start", start)

             container.setAttribute("data-docsLength", docslength)
             
            // render HTML and append to container
            container.append(
              template({
                items: response.response.docs
              })
            )
            
            if (start + docslength === numfound) body.addClass('io-done')


            Y.log(response.response.start + response.response.docs.length)
                        
            body.removeClass('io-loading')
            
            loadMoreButton.removeClass('pure-button-disabled')

        }
        catch (e) {
            Y.log('error')
        }
    }

    Y.IdleTimer.subscribe('idle', onScroll)

    // be opportunistic
    Y.IdleTimer.start(5000)

    // Plug ScrollInfo 
    body.plug(Y.Plugin.ScrollInfo, { scrollMargin: fold })

    body.scrollInfo.on({ scroll: onScroll })

    Y.on('available', onPaginatorAvailable, 'ul.pure-paginator')

    // set the request URL
    href = datasourceURL
     
    // make the first request
    Y.jsonp(href, {
        on: {
            success: onSuccess,
            failure: onFailure,
            timeout: onTimeout
        },
        timeout: 3000
    })
    
    loadMoreButton.on('click', onClick)
    
    body.delegate('submit', onSubmit, 'form')     

})