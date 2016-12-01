// let  $ = require('jquery');
// import React from 'react';
// import * as React from "react";
// import * as ReactDOM from "react-dom";
// import {Board} from 'activetabs';
let windowHeight: Number;
let sidebar: any;
let resultTable : any;
let results: any;
let sender: String = 'content';
let $grid: any;

///QUERY
function query(queryString: String = 'table#searchResult tbody td'){
    console.log($(queryString));
    $('.eg_results_table').empty();
    return $(queryString);
}
function createQueryResultaTable(){
    let sidebar = $("<div/>");
    sidebar.addClass('eg_sidebar');
    $('body').append(sidebar);
    sidebar.css({
        'position':'fixed', 'width': '400px', 'height': windowHeight, 'min-height': '700px',
        'background': 'white',
        'overflow-y': 'scroll',
        'right':"-400px",
        'top':'0',
        'box-shadow':'0 0 10px 0 #000',
        'z-index': '9999'
    });
    let queryinput = $('<input type="text" placeholder="Insert your query here" class="query-input" style="width: 100%;padding: 10px; margin-bottom: 15px;"/>');
    sidebar.append(queryinput);
    queryinput.on('keyup',function(e){
        if (e.keyCode == 13){
            let queryString = queryinput.val();
            results = query(queryString);
            manageQueryResultTable(results);
        }
    });
    resultTable = $(`<table class="eg_results_table table table-bordered"></table>`);
    sidebar.append(resultTable);
    return resultTable;
}

function manageQueryResultTable(results: any[]){    
    $.each(results,function(index,value){
        // let name = $(value).find('.detName a').text();
        // let url = $(value).find('> a').first().attr('href');
        let tr = $('<tr/>');
        resultTable.append(tr);
        let tableRow = `<td>${index+1}</td><td>${value.outerHTML}</td>`;
        tr.append(tableRow);

    });
}
////TABS
function onRemove(e:any){
		// let e = new Array(e);
		e = e.target;
		if(e != undefined) {
	        let id = e.dataset.id;
	        requestCloseTab(id);
	        $(e).parents('.list-group-item').remove();
	    }
}
function requestCloseTab(data) {
    let confirmation = window.confirm("Are you sure you want to close this tab");
    if (confirmation) packageAndBroadcast( sender ,'background','closeTab',data);
}
function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}

    let ActiveTab = React.createClass({
        propTypes: {
            data: React.PropTypes.array
         },
        getDefaultProps: ()=> {
            return {
                data: []
            }
        },
        render: function() {
            return (
                
                <ul className="tabs-list list-group">
                {this.props.data.map(function(value) {
                    return <li key={value.id} className="list-group-item">
                            <span className = {(value.pinned ? ` `: `disabled`)+ ` glyphicon glyphicon-pushpin pinned`} aria-hidden='true'></span>
                            <span className={(value.audible ? ` `: `disabled`)+ ` glyphicon glyphicon-volume-off audible`} aria-hidden='true'></span>
                            <img src={value.favIconUrl}/>
                            <a title={value.title} target='_blank'>{value.title}</a>
                            <div className="options pull-right">
                                <span data-id={value.id} data-command='remove' className='remove-tab glyphicon glyphicon-remove' aria-hidden='true'></span>
                            </div>
                           </li>
                })}
                </ul>
            )
        }
    });
    let Note = React.createClass({
        getInitialState: ()=>{
            return {editing: false}
        },
        componentWillMount: ()=>{
            this.style = {
                right: this.randomBetween(0, window.innerWidth - 150) + 'px',
                top: this.randomBetween(0, window.innerHeight - 150) + 'px',
                transform: 'rotate(' + this.randomBetween(-15, 15) + 'deg)'
            };
        },
        componentDidMount: ()=>{
            $(this.getDOMNode()).draggable();
        },
        randomBetween: (min, max)=>{
            return (min + Math.ceil(Math.random() * max));
        },
        edit: ()=>{
            this.setState({editing: true});
        },
        save: ()=>{
            this.props.onChange(this.refs.newText.getDOMNode().value, this.props.index);
            this.setState({editing: false});
        },
        remove: ()=>{
            this.props.onRemove(this.props.index);
        },
        renderDisplay: ()=>{
            return (
                <div className="note"
                    style={this.style}>
                    <p>{this.props.children}</p>
                    <span>
                        <button onClick={this.edit}
                                className="btn btn-primary glyphicon glyphicon-pencil"/>
                        <button onClick={this.remove}
                                className="btn btn-danger glyphicon glyphicon-trash"/>
                    </span>
                </div>
                );
        },
        renderForm: ()=>{
            return (
                <div className="note" style={this.style}>
                <textarea ref="newText" defaultValue={this.props.children} 
                className="form-control"></textarea>
                <button onClick={this.save} className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk" />
                </div>
                )
        },
        render: ()=>{
            if (this.state.editing) {
                return this.renderForm();
            }
            else {
                return this.renderDisplay();
            }
        }
    });

    let Board = React.createClass({
        propTypes: {
            count: function(props, propName) {
                if (typeof props[propName] !== "number"){
                    return new Error('The count property must be a number');
                }
                if (props[propName] > 100) {
                    return new Error("Creating " + props[propName] + " notes is ridiculous");
                }
            }
        },
        getInitialState: function() {
            return {
                notes: []
            };
        },
        nextId: function() {
            this.uniqueId = this.uniqueId || 0;
            return this.uniqueId++;
        },
        // componentWillMount: function() {
        //     let self = this;
        //     if(this.props.count) {
        //         $.getJSON("http://baconipsum.com/api/?type=all-meat&sentences=" +
        //             this.props.count + "&start-with-lorem=1&callback=?", function(results){
        //                 results[0].split('. ').forEach(function(sentence){
        //                     self.add(sentence.substring(0,40));
        //                 });
        //             });
        //     }
        // },
        add: function(text) {
            let arr = this.state.notes;
            arr.push({
                id: this.nextId(),
                note: text
            });
            this.setState({notes: arr});
        },
        update: function(newText, i) {
            let arr = this.state.notes;
            arr[i].note = newText;
            this.setState({notes:arr});
        },
        remove: function(i) {
            let arr = this.state.notes;
            arr.splice(i, 1);
            this.setState({notes: arr});
        },
        eachNote: function(note, i) {
            return (
                    <Note key={note.id}
                        index={i}
                        onChange={this.update}
                        onRemove={this.remove}
                    >{note.note}</Note>
                );
        },
        render: function() {
            return (<div className="board">
                        {this.state.notes.map(this.eachNote)}
                        <button className="btn btn-sm btn-success glyphicon glyphicon-plus"
                                onClick={this.add.bind(null, "New Note")}/>
                </div>

            );
        }
        });


//////////////////////////////////////////////////////////////////
$(document).ready(function(){
   
    windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	$('.tabs-list-container').on('click','.remove-tab',function(e){
        onRemove(e);
    });
    $('.tabs-list-container').on('click','.list-group-item a',function(e){
        let data = $(e.target).parents('li').attr('tab-id');
		packageAndBroadcast(sender,"background","focusTab",data);
	});
    $('.tabs-list-container').on('click','.list-group-item span.pinned',function(e){
        let data = $(e.target).parents('li').attr('tab-id');
        
        if( $(this).hasClass("disabled"))
            {packageAndBroadcast(sender,"background","pinTab",data); }
        else
            {packageAndBroadcast(sender,"background","unpinTab",data); }
        $(this).toggleClass("disabled");
    });
    $('.tabs-list-container').on('click','.list-group-item span.audible',function(e){
        let data = $(e.target).parents('li').attr('tab-id');
        
        if( $(this).hasClass("disabled"))
            {packageAndBroadcast(sender,"background","unmuteTab",data); }
        else
            {packageAndBroadcast(sender,"background","muteTab",data); }
        $(this).toggleClass("disabled");
    });
    // $('.tabs-list-container').on('click','.list-group-item span.pinned',function(e){
    //     let data = $(e.target).parents('li').attr('tab-id');
    //     packageAndBroadcast(sender,"background","unpinTab",data);
    //     $(this).toggleClass("disabled");
    // });

    createQueryResultaTable();

    // manageQueryResultTable(results);



    // $("html").on("contextmenu",function(e){
    //            //prevent default context menu for right click
    //            // e.preventDefault();

    //            var menu = $(".menu"); 

    //            //hide menu if already shown
    //            menu.hide(); 
               
    //            //get x and y values of the click event
    //            var pageX = e.pageX;
    //            var pageY = e.pageY;

    //            //position menu div near mouse cliked area
    //            menu.css({top: pageY , left: pageX});

    //            var mwidth = menu.width();
    //            var mheight = menu.height();
    //            var screenWidth = $(window).width();
    //            var screenHeight = $(window).height();

    //            //if window is scrolled
    //            var scrTop = $(window).scrollTop();

    //            //if the menu is close to right edge of the window
    //            if(pageX+mwidth > screenWidth){
    //                menu.css({left:pageX-mwidth});
    //            }

    //            //if the menu is close to bottom edge of the window
    //            if(pageY+mheight > screenHeight+scrTop){
    //                menu.css({top:pageY-mheight});
    //            }

    //            //finally show the menu
    //            menu.show();
    //     }); 
        
    //     $("html").on("click", function(){
    //         $(".menu").hide();
    //     });

});
////////////////////////////////////////////////////////////////////

// document.addEventListener('click', function(e) {
//     if (hasClass(e.target, 'remove-tab')) {
//         console.log(e.target);
        
//     }
// }, false);


/**
 * Makes a HTML list of given data (Mainly for Tabs)
 * @param  {[type]} data [description]
 * @return {HTML Entity}      [description]
 */
function enlistTabs(data) {
    console.log(data);
    let list = $("<ul/>");
    list.addClass('tabs-list list-group');
    $.each(data, function(index, value) {
        options = $(`<div class='options pull-right'></div>`);
        let pinned = $(`<span class='disabled glyphicon glyphicon-pushpin pinned' aria-hidden='true'></span>`);
        let audible = $(`<span class='disabled glyphicon glyphicon-volume-off audible' aria-hidden='true'></span>`);
        img = $(`<img src='${value.favIconUrl}'/>`);
        item = $(`<li tab-id='${value.id}'><a title='${value.title}' target='_blank'>${value.title}</a></li>`)
        if (value.pinned) pinned = $(`<span class='glyphicon glyphicon-pushpin pinned' aria-hidden='true'></span>`);
        if (value.audible) audible = $(`<span class='glyphicon glyphicon-volume-up audible' aria-hidden='true'></span>`);
        remove = $(`<span data-id='${value.id}' data-command='remove' class='remove-tab glyphicon glyphicon-remove' aria-hidden='true'></span>`);
        options.prepend(remove);
        item.addClass('list-group-item');
        item.prop({ 'draggable': true });
        data2DOM(item, value);
        item.prepend(img);
        item.prepend(pinned);
        item.prepend(audible);
        item.append(options);
        list.append(item);
        ReactDOM.render(<ActiveTab name={value.url} />, 
            document.getElementById('react-container'));
    });
    return list;

}
/**
 * Will attach data from Chrome tabs to HTML nodes to retreive later
 * @param  {Element} element [description]
 * @param  {Object} data    [description]
 */
function data2DOM(el, data) {
    ignoredKeys = ['url', 'favIconUrl', 'title'];
    for (let property in data) {
        if (property == ignoredKeys[0] || property == ignoredKeys[1] || property == ignoredKeys[2]) continue;
        if (data.hasOwnProperty(property)) {
            el.data(property, data[property]);
        }
    }
}
chrome.runtime.onMessage.addListener(function(request, sender) {
    url = chrome.extension.getURL("/_generated_background_page.html");
    if (sender.url == url) {
        console.log(location);
        console.log("getting from background", request, sender);
        let tabsList = request.tabsList;
        // tabsList = enlistTabs(tabsList);
        // $('.tabs-list-container').html(tabsList);
        ReactDOM.render(<ActiveTab data={tabsList} />, 
            document.getElementById('active-tabs-list-container'));
        // delete tabsList;
        
    } else {
        // Content script code
    }

});
