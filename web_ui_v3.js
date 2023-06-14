let WebUI = {}
let history = [];   //#계산수식 저장배열
let historyValue = [];

WebUI.WidgetTypes = {
    UNDEFINED:      "undefind",
    TEXT:           "text",
    IMAGE:          "image",
    PUSH_BUTTON:    "push_button",
    MY_PUSH_BUTTON: "my_push_button",
    TEXT_FIELD:     "text_field",
    SWITCH:         "switch",
    CONTAINER:      "container",
    ROW:            "row",
    COLUMN:         "column",
    MY_GRID_LAYOUT: "my_grid_layout",
    MY_LIST_VIEW:   "my_list_view"
};

WebUI.Alignment = {
    CENTER:         "center",
    LEFT:           "left",
    RIGHT:          "right",
    TOP:            "top",
    BOTTOM:         "bottom" 
};
WebUI.widgets = [];
WebUI.parser = math.parser();
WebUI.focused_widget = null;
WebUI.dragged_widget = null;
WebUI.hovered_widget = null;

WebUI.is_mouse_dragging = false;       
WebUI.mouse_drag_start = {x:0, y:0};
WebUI.mouse_drag_prev = {x:0, y:0};

WebUI.app = null;

WebUI.initialize = function() {
    this.canvas = new fabric.Canvas("c", {
        backgroundColor: "#eee",
        hoverCursor: "default",
        selection: false,
        width: window.innerWidth,
        height: window.innerHeight
    });

    //
    $(document).keypress(function(event) {
        WebUI.handleKeyPress(event);
    });
    $(document).mousedown(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseDown(p);
    });
    $(document).mouseup(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseUp(p);
    });
    $(document).mousemove(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseMove(p);
    });

    //
    WebUI.initWidgets();
    WebUI.initVisualItems();
    WebUI.layoutWhenResourceReady();
}

WebUI.initWidgets = function() {
    WebUI.app = new WebUI.Row({
        children: [
            new WebUI.Container({
                desired_size: {width: 500, height: 120},
                horizontal_alignment: WebUI.Alignment.CENTER,
                vertical_alignment: WebUI.Alignment.CENTER,
                children: [new WebUI.TextField("0", {width: 450, height: 100}),]
            }),
            new WebUI.Container({
                desired_size: {width: 500, height: 70},
                horizontal_alignment: WebUI.Alignment.CENTER,
                vertical_alignment: WebUI.Alignment.CENTER,
                children: [new WebUI.TextField("0", {width: 450, height: 40}),]
            }),
            new WebUI.Column({
                desired_size: {width: 450, height: 10},
            }),
            new WebUI.Row({
                children: [
                   new WebUI.Column({
                       desired_size: {width: 500},
                       horizontal_alignment: WebUI.Alignment.CENTER,
                       vertical_alignment: WebUI.Alignment.CENTER,
                       children: [
                            new WebUI.MyPushButton("<", {width: 65, height: 40}),
                            new WebUI.MyPushButton(">", {width: 65, height: 40}),
                            new WebUI.MyPushButton("<=", {width: 65, height: 40}),
                            new WebUI.MyPushButton(">=", {width: 65, height: 40}),
                            new WebUI.MyPushButton("==", {width: 65, height: 40}),
                            new WebUI.MyPushButton("!=", {width: 65, height: 40}),
                       ]
                   }),
                   new WebUI.Column({
                        desired_size: {width: 500},
                        horizontal_alignment: WebUI.Alignment.CENTER,
                        vertical_alignment: WebUI.Alignment.CENTER,
                        children: [
                            new WebUI.MyPushButton("i", {width: 54, height: 40,}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("e", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("pi", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("w", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("x", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("y", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("z", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                        ]
                    }),
                    new WebUI.Column({
                        desired_size: {width: 500},
                        horizontal_alignment: WebUI.Alignment.CENTER,
                        vertical_alignment: WebUI.Alignment.CENTER,
                        children: [
                            new WebUI.MyPushButton("f", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("g", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("exp", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("log", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("sqrt", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("cross", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("det", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                        ]
                    }),
                    new WebUI.Column({
                        desired_size: {width: 500},
                        horizontal_alignment: WebUI.Alignment.CENTER,
                        vertical_alignment: WebUI.Alignment.CENTER,
                        children: [
                            new WebUI.MyPushButton("(", {width: 54, height: 40}),
                            new WebUI.MyPushButton(")", {width: 54, height: 40}),
                            new WebUI.MyPushButton("^", {width: 54, height: 40}),
                            new WebUI.MyPushButton("sin", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("cos", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("tan", {width: 54, height: 40}, {font_family: 'Times New Roman'}),
                            new WebUI.MyPushButton("=", {width: 54, height: 40}),
                        ]
                    }),
                    new WebUI.Column({
                        desired_size: {width: 500   },
                        horizontal_alignment: WebUI.Alignment.CENTER,
                        vertical_alignment: WebUI.Alignment.CENTER,
                        children: [
                            new WebUI.MyPushButton("[", {width: 54, height: 40}),
                            new WebUI.MyPushButton("]", {width: 54, height: 40}),
                            new WebUI.Column( {
                                desired_size: {width: 310, height: 40},
                                horizontal_alignment: WebUI.Alignment.RIGHT,
                                vertical_alignment: WebUI.Alignment.CENTER,
                                children: [
                                    new WebUI.MyPushButton("◀", {width: 36, height: 40}),
                                    new WebUI.MyPushButton("▶", {width: 36, height: 40}),
                                    new WebUI.MyPushButton("History", {width: 80, height: 40}, {fill_color: '#50bcdf', font_size: 15})
                                ]
                            })
                        ]
                    }),
               ]
            }),            
            new WebUI.Column({
                desired_size: {width: 450, height: 10},
            }),
            new WebUI.Row({
                children: [
                    new WebUI.Column({
                        desired_size: {width: 500},
                        horizontal_alignment: WebUI.Alignment.CENTER,
                        vertical_alignment: WebUI.Alignment.CENTER,
                        children: [
                            new WebUI.MyPushButton("7", {width: 80, height: 40}),
                            new WebUI.MyPushButton("8", {width: 80, height: 40}),
                            new WebUI.MyPushButton("9", {width: 80, height: 40}),
                            new WebUI.MyPushButton("%", {width: 80, height: 40}),
                            new WebUI.MyPushButton("<-", {width: 80, height: 40}, {fill_color: '#7cfc00'}),
                        ]
                    }),
                    new WebUI.Column({
                        desired_size: {width: 500},
                        horizontal_alignment: WebUI.Alignment.CENTER,
                        vertical_alignment: WebUI.Alignment.CENTER,
                        children: [
                            new WebUI.MyPushButton("4", {width: 80, height: 40}),
                            new WebUI.MyPushButton("5", {width: 80, height: 40}),
                            new WebUI.MyPushButton("6", {width: 80, height: 40}),
                            new WebUI.MyPushButton("*", {width: 80, height: 40}),
                            new WebUI.MyPushButton("/", {width: 80, height: 40}),
                        ]
                    }),
                    new WebUI.Column({
                        desired_size: {width: 500},
                        horizontal_alignment: WebUI.Alignment.CENTER,
                        vertical_alignment: WebUI.Alignment.CENTER,
                        children: [
                            new WebUI.MyPushButton("1", {width: 80, height: 40}),
                            new WebUI.MyPushButton("2", {width: 80, height: 40}),
                            new WebUI.MyPushButton("3", {width: 80, height: 40}),
                            new WebUI.MyPushButton("+", {width: 80, height: 40}),
                            new WebUI.MyPushButton("-", {width: 80, height: 40}),
                        ]
                    }),
                    new WebUI.Column({
                        desired_size: {width: 500},
                        horizontal_alignment: WebUI.Alignment.CENTER,
                        vertical_alignment: WebUI.Alignment.CENTER,
                        children: [
                            new WebUI.MyPushButton("0", {width: 80, height: 40}),
                            new WebUI.MyPushButton(".", {width: 80, height: 40}),
                            new WebUI.MyPushButton(",", {width: 80, height: 40}),
                            new WebUI.MyPushButton("CL", {width: 80, height: 40}, {fill_color: '#7cfc00'}),
                            new WebUI.MyPushButton("EV", {width: 80, height: 40}, {fill_color: 'red'}),
                            
                        ]
                    }),
                    new WebUI.Container({
                        desired_size: {width: 500},
                        horizontal_alignment: WebUI.Alignment.CENTER,
                        vertical_alignment: WebUI.Alignment.CENTER,
                        children: [
                            new WebUI.MyListView("0", {width: 450, height: 100})
                        ]
                    }),
                ]
            }),
        ]
    });
}

//
WebUI.initVisualItems = function() {
    WebUI.widgets.forEach(widget => {
        widget.initVisualItems();
    });
}

WebUI.layoutWhenResourceReady = function() {
    let is_resource_loaded = true;
    for (let i in WebUI.widgets) {
        let widget = WebUI.widgets[i];
        if (!widget.is_resource_ready) {
            is_resource_loaded = false;
            break;
        }
    }

    if (!is_resource_loaded) {
        setTimeout(arguments.callee, 50);
    }
    else {
        WebUI.app.layout();
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleKeyPress = function(event) {
    let is_handled = false;

    if (WebUI.focused_widget) {
        is_handled = WebUI.focused_widget.handleKeyPress(event) || is_handled;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseDown = function(window_p) {
    let is_handled = false;

    if (WebUI.isInCanvas(window_p)) {
        let canvas_p = WebUI.transformToCanvasCoords(window_p);        

        WebUI.is_mouse_dragging = true;
        WebUI.mouse_drag_start = canvas_p;
        WebUI.mouse_drag_prev = canvas_p;

        let widget = WebUI.findWidgetOn(canvas_p);
        if (widget) {
            WebUI.focused_widget = widget;    

            if (widget.is_draggable) {
                WebUI.dragged_widget = widget;
            }
            else {
                WebUI.dragged_widget = null;
            }

            is_handled = widget.handleMouseDown(canvas_p) || is_handled;
        }
        else {
            WebUI.focused_widget = null;
            WebUI.dragged_widget = null;
        }
    }
    else {
        WebUI.is_mouse_dragging = false;
        WebUI.mouse_drag_start = {x:0, y:0};
        WebUI.mouse_drag_prev = {x:0, y:0};

        WebUI.focused_widget = null;
        WebUI.dragged_widget = null;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseMove = function(window_p) {
    let canvas_p = WebUI.transformToCanvasCoords(window_p);
    let is_handled = false;

    let widget = WebUI.findWidgetOn(canvas_p);
    if (widget != WebUI.hovered_widget) {
        if (WebUI.hovered_widget != null) {
            is_handled = WebUI.hovered_widget.handleMouseExit(canvas_p) || is_handled;
        }
        if (widget != null) {
            is_handled = widget.handleMouseEnter(canvas_p) || is_handled;
        }
        WebUI.hovered_widget = widget;
    }
    else {
        if (widget) {
            is_handled = widget.handleMouseMove(canvas_p) || is_handled;
        }
    }

    if (WebUI.is_mouse_dragging) {
        if (WebUI.dragged_widget != null) {
            let tx = canvas_p.x - WebUI.mouse_drag_prev.x;
            let ty = canvas_p.y - WebUI.mouse_drag_prev.y;
            WebUI.dragged_widget.translate({x: tx, y: ty});

            is_handled = true;
        }
        WebUI.mouse_drag_prev = canvas_p;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseUp = function(window_p) {
    let is_handled = false;
    let canvas_p = WebUI.transformToCanvasCoords(window_p);

    let widget  = WebUI.findWidgetOn(canvas_p);
    if (widget) {
        is_handled = widget.handleMouseUp(canvas_p) || is_handled;
    }

    if (WebUI.is_mouse_dragging) {
        WebUI.is_mouse_dragging = false;
        WebUI.mouse_drag_start = {x:0, y:0};
        WebUI.mouse_drag_prev = {x:0, y:0};

        WebUI.dragged_widget = null;
        
        is_handled = true;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.transformToCanvasCoords = function(window_p) {
    let rect = WebUI.canvas.getElement().getBoundingClientRect();
    let canvas_p = {
        x : window_p.x - rect.left,
        y : window_p.y - rect.top
    };
    return canvas_p;
}

WebUI.isInCanvas = function(window_p) {
    let rect = WebUI.canvas.getElement().getBoundingClientRect();
    if (window_p.x >= rect.left && 
        window_p.x < rect.left + rect.width &&
        window_p.y >= rect.top && 
        window_p.y < rect.top + rect.height) {
        return true;
    }
    else {
        return false;
    }
}

WebUI.findWidgetOn = function(canvas_p) {
    let x = canvas_p.x;
    let y = canvas_p.y;

    for (let i=0; i < this.widgets.length; i++) {
        let widget = this.widgets[i];

        if (x >= widget.position.left &&
            x <= widget.position.left + widget.size.width &&
            y >= widget.position.top &&
            y <= widget.position.top + widget.size.height) {
            return widget;
        }               
    }
    return null;
}//
WebUI.maxSize = function(size1, size2) {
    let max_size = {width: 0, height: 0};

    max_size.width = (size1.width > size2.width) ? size1.width : size2.width;
    max_size.height  = (size1.height > size2.height) ? size1.height : size2.height;
    return max_size;
}
//
WebUI.minSize = function(size1, size2) {
    let min_size = {width: 0, height: 0};

    min_size.width = (size1.width > size2.width) ? size1.width : size2.width;
    min_size.height = (size1.height > size2.height) ? size1.height : size2.height;
    return min_size;
}


//
WebUI.Widget = function(properties) {
    this.type = WebUI.WidgetTypes.UNDEFINED;
    
    this.is_draggable = false;
    this.is_movable = true;

    //
    this.parent = null;
    this.children = [];
    
    //
    this.position = {left: 0, top: 0};
    this.size = {width: 0, height: 0};

    //
    this.visual_items = [];
    this.is_resource_ready = false;

    //
    WebUI.widgets.push(this);

    if(properties != undefined) {   //
        for(let name in properties) {
            let value = properties[name];
            if(name == 'children') {
                value.forEach(child => {
                    child.parent = this;
                    this.children.push(child);
                });
            }
            else {
                this[name] = value;
            }
        }
    }

    //
    this.setDefaultProperty('desired_size', {width: 0, height: 0});
    this.setDefaultProperty('horizontal_alignment', WebUI.Alignment.CENTER);
    this.setDefaultProperty('vertical_alignment', WebUI.Alignment.TOP);
    this.setDefaultProperty('fill_color', 'white');
    this.setDefaultProperty('stroke_color', 'black');
    this.setDefaultProperty('stroke_width', 1);
    this.setDefaultProperty('text_align', 'left');
    this.setDefaultProperty('text_color', 'black');
    this.setDefaultProperty('font_family', 'System');
    this.setDefaultProperty('font_size', 20);
    this.setDefaultProperty('font_weight', 'bold');
    this.setDefaultProperty('padding', 5);
    this.setDefaultProperty('margin', 10);
}

WebUI.Widget.prototype.setDefaultProperty = function(name, value) {
    if (this[name] == undefined) {
        this[name] = value;
    }
}

WebUI.Widget.prototype.getBoundingRect = function() {
    return {
        left:   this.position.left, 
        top:    this.position.top,
        width:  this.size.width,
        height: this.size.height
    };
}

WebUI.Widget.prototype.layout = function() {
    //
    this.measure();

    //
    this.arrange(this.position);
}
//
WebUI.Widget.prototype.measure = function() {
    if(this.children.length > 0) {
        this.size_children = {width: 0, height: 0};
        this.children.forEach(child => {
            let size_child = child.measure();
            this.size_children = this.extendSizeChildren(this.size_children, size_child);
        });
        this.size = WebUI.maxSize(this.desired_size, this.size_children);
    }
    else {
        this.size.width += this.padding * 2;
        this.size.height += this.padding * 2;
    }
    return this.size;
}
//
WebUI.Widget.prototype.arrange = function(position) {
    //arrange this
    this.moveTo(position);
    this.visual_items.forEach(item => {WebUI.canvas.add(item);});

    //arrange children
    if(this.children.length > 0) {
        let left_spacing = 0, top_spacing = 0;

        if(this.size.width > this.size_children.width) {
            let room_width = this.size.width - this.size_children.width;

            if(this.horizontal_alignment == WebUI.Alignment.LEFT)
                left_spacing = this.padding;
            else if(this.horizontal_alignment == WebUI.Alignment.CENTER)
                left_spacing = this.padding + room_width / 2.0;
            else if(this.horizontal_alignment == WebUI.Alignment.RIGHT)
                left_spacing = this.padding + room_width;
        }
        if(this.size.height > this.size_children.height) {
            let room_height = this.size.height - this.size_children.height;

            if(this.vertical_alignment == WebUI.Alignment.TOP)
                top_spacing = this.padding;
            else if(this.vertical_alignment == WebUI.Alignment.CENTER)
                top_spacing = this.padding + room_height / 2.0;
            else if(this.vertical_alignment == WebUI.Alignment.BOTTOM) 
                top_spacing = this.padding + room_height;
        }

        let next_position = {left: position.left + left_spacing,
                            top: position.top + top_spacing};
        this.children.forEach(child => {
            child.arrange(next_position);
            next_position = this.calcNextPosition(next_position, child.size);
        })
    }

}

// default implementation that is expected to be overridden
WebUI.Widget.prototype.extendSizeChildren = function(size, child_size) {
    if (size.width < child_size.width)      size.width = child_size.width;
    if (size.height < child_size.height)    size.height = child_size.height;

    return size;
}

// default implementation that is expected to be overridden
WebUI.Widget.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left + size.width;
    let next_top = position.top;

    return {left: next_left, top: next_top};
}


WebUI.Widget.prototype.initVisualItems = function() {
    this.is_resource_ready = true;
    return true;
}

WebUI.Widget.prototype.moveTo = function(p) {
    if(!this.is_movable)
    {
        return;
    }

    let tx = p.left - this.position.left;
    let ty = p.top - this.position.top;

    this.translate({x: tx, y: ty});
}

WebUI.Widget.prototype.translate = function(v) {
    if(!this.is_movable)
    {
        return;
    }

    this.position.left += v.x;
    this.position.top += v.y;

    this.visual_items.forEach(item => {
        item.left += v.x;
        item.top += v.y;
    });

    this.children.forEach(child_widget => {
        child_widget.translate(v);
    });
}

WebUI.Widget.prototype.destroy = function() {
    if (this == WebUI.focused_widget) WebUI.focused_widget = null;
    if (this == WebUI.dragged_widget) WebUI.dragged_widget = null;
    if (this == WebUI.hovered_widget) WebUI.hovered_widget = null;

    this.visual_items.forEach(item => {
        WebUI.canvas.remove(item);
    });
    this.visual_items = [];
    
    let index = WebUI.widgets.indexOf(this);
    if(index > -1)
    {
        WebUI.widgets.splice(index, 1);
    }

    this.children.forEach(child_widget => {
        child_widget.destroy();
    });
    this.children = [];

    // assume that the parent is already null 
    // (that is, this widget has been detached from its original parent before being destructed)
}

WebUI.Widget.prototype.handleKeyPress = function(event) {
    return false;
}

WebUI.Widget.prototype.handleMouseDown = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseMove = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseUp = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseEnter = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseExit = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleResize = function() {
    return false;
}


//
WebUI.Container = function(properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.CONTAINER;
}

WebUI.Container.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Container.prototype.constructor = WebUI.Container;
//
WebUI.Container.prototype.extendSizeChildren = function(size, child_size) {
    if(size.width < child_size.width) size.width = child_size.width;
    if(size.height < child_size.height) size.height = child_size.height;
    return size;
}
//
WebUI.Container.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left;
    let next_top = position.top;
    return {left: next_left, top: next_top};
}

//
WebUI.Column = function(properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.COLUMN;
}

WebUI.Column.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Column.prototype.constructor = WebUI.Column;
//
WebUI.Column.prototype.extendSizeChildren = function(size, child_size) {
    size.width += child_size.width;
    if(size.height < child_size.height) size.height = child_size.height;
    return size;
}
//
WebUI.Column.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left + size.width;
    let next_top = position.top;
    return {left: next_left, top: next_top};
}


//
WebUI.Row = function(properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.ROW;
}

WebUI.Row.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Row.prototype.constructor = WebUI.Row;
//
WebUI.Row.prototype.extendSizeChildren = function(size, child_size) {
    if(size.width < child_size.width) size.width = child_size.width;
    size.height += child_size.height;
    return size;
}
//
WebUI.Row.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left;
    let next_top = position.top + size.height;
    return {left: next_left, top: next_top};
}

//# MyGridLayout 생성. 구현 실패
//열의 갯수를 지정하여 자동으로 위젯을 배치. 크기가 같은 위젯만 배치 가능
WebUI.MyGridLayout = function(gridCol, properties) {
    WebUI.Widget.call(this, properties);
    this.gridCol = gridCol; //# 갖게되는 열의 갯수
    this.gridRow = 0;       //# 갖게되는 행의 갯수
    this.currentCol = 0;    //현재 열
    this.currentRow = 1;    //현재 행
    this.type = WebUI.WidgetTypes.MY_GRID_LAYOUT;

    ////test
    console.log(properties.length);
}

WebUI.MyGridLayout.prototype = Object.create(WebUI.Widget.prototype);
WebUI.MyGridLayout.prototype.constructor = WebUI.MyGridLayout;
//
WebUI.MyGridLayout.prototype.extendSizeChildren = function(size, child_size) {
    if(this.currentRow == 0) {
        size.width += child_size.width;
        size.height = child_size.height;
        
        this.currentCol++;
        if(this.currentCol == this.gridCol) {
            this.currentCol = 0;
        }

        return size;
    }
    else {  //두번때 행 부터. 같은크기 위젯 상정했으므로 이제 높이만 변경해줌
        size.height = child_size.height * (this.gridRow + 1);   //갖는 행의 갯수만큼 높이 설정

        this.currentCol++;
        if(this.currentCol == this.gridCol) {
            this.currentCol = 0;
            this.gridRow++;
        }

        return size;
    }
}
//
WebUI.MyGridLayout.prototype.calcNextPosition = function(position, size) {
    if(this.currentRow == 0) {

    }
    let next_left = position.left + size.width;
    let next_top = position.top;

    return {left: next_left, top: next_top};
}






//
WebUI.Text = function(label, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.TEXT;
    this.label = label;
}

WebUI.Text.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Text.prototype.constructor = WebUI.Text;

WebUI.Text.prototype.initVisualItems = function() {
    let text = new fabric.Text(this.label, {
        left:       this.position.left,
        top:        this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });
    let bound = text.getBoundingRect();
    this.position.left = bound.left;
    this.position.top = bound.top;
    this.size.width = bound.width;
    this.size.height = bound.height;    

    this.visual_items.push(text);
    this.is_resource_ready = true;
}

WebUI.Text.prototype.setLabel = function(new_label) {
    let text = this.visual_items[0];
    text.set('text', new_label);

    this.label = new_label;

    WebUI.canvas.requestRenderAll();
}

//
WebUI.Image = function(path, desired_size, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.IMAGE;
    this.path = path;
    this.desired_size = desired_size;
}

WebUI.Image.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Image.prototype.constructor = WebUI.Image;

WebUI.Image.prototype.initVisualItems = function() {
    let widget = this;

    fabric.Image.fromURL(this.path, function(img) {
        console.log("Image[" + widget.path + "] is loaded");

        if (widget.desired_size != undefined) {
            img.scaleToWidth(widget.desired_size.width);
            img.scaleToHeight(widget.desired_size.height);
            widget.size = widget.desired_size;
        }
        else {
            widget.size = {width: img.width, height: img.height};
        }

        img.set({
            left: widget.position.left,
            top: widget.position.top,
            selectable: false,
        });

        widget.visual_items.push(img);
        widget.is_resource_ready = true;
    });
}

//
WebUI.TextField = function(label, desired_size, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.TEXT_FIELD;
    this.label = label;
    this.desired_size = desired_size;

    this.stroke_width = 5;
}

WebUI.TextField.prototype = Object.create(WebUI.Widget.prototype);
WebUI.TextField.prototype.constructor = WebUI.TextField;

WebUI.TextField.prototype.initVisualItems = function() {
    let boundary = new fabric.Rect({
        left: this.position.left,
        top: this.position.top,
        width: this.desired_size.width,
        height: this.desired_size.height,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: this.stroke_width,
        selectable: false
    });

    let textbox = new fabric.Textbox(this.label, {
            left:       this.position.left + this.margin,
            selectable: false,
            fontFamily: this.font_family,
            fontSize:   this.font_size,
            fontWeight: this.font_weight,
            textAlign:  this.text_align,
            stroke:     this.text_color,
            fill:       this.text_color,
        }
    );

    let bound = textbox.getBoundingRect();
    textbox.top = this.position.top + this.desired_size.height/2 - bound.height/2;

    this.size = this.desired_size;

    //
    this.visual_items.push(boundary);
    this.visual_items.push(textbox);
    this.is_resource_ready = true;
}

WebUI.TextField.prototype.handleMouseDown = function(canvas_p) {
    let textbox = this.visual_items[1];        
    textbox.enterEditing();

    return true;
}

WebUI.TextField.prototype.handleKeyPress = function(event) {    //엔터키와 영역벗어나는거 조절
    let boundary = this.visual_items[0];
    let textbox = this.visual_items[1];        

    let new_label = textbox.text;
    let old_label = this.label;
    this.label = new_label;

    if (event.keyCode == 13) {  //event.keyCode 13 = Enter키
        let text_enter_removed = new_label.replace(/(\r\n|\n|\r)/gm, "");
        textbox.text = text_enter_removed;
        this.label = text_enter_removed;
        
        if (textbox.hiddenTextarea != null) {
            textbox.hiddenTextarea.value = text_enter_removed;
        }

        textbox.exitEditing();

        return true;    
    }

    if (old_label != new_label && old_label.length < new_label.length) {
        let canvas = document.getElementById("c");
        let context = canvas.getContext("2d");
        context.font = this.font_size.toString() + "px " + this.font_family;

        let boundary_right = boundary.left + boundary.width - this.margin;
        let text_bound = textbox.getBoundingRect();
        let text_width = context.measureText(new_label).width;
        let text_right = text_bound.left + text_width;

        if (boundary_right < text_right) {
            textbox.text = old_label;
            this.label = old_label;
            
            if (textbox.hiddenTextarea != null) {
                textbox.hiddenTextarea.value = old_label;
            }

            return true;
        }
    }
    
    return false;
}

//
WebUI.PushButton = function(label, desired_size, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.PUSH_BUTTON;
    this.label = label;
    this.desired_size = desired_size;

    this.is_pushed = false;
}

WebUI.PushButton.prototype = Object.create(WebUI.Widget.prototype);
WebUI.PushButton.prototype.constructor = WebUI.PushButton;

WebUI.PushButton.prototype.initVisualItems = function() {
    let background = new fabric.Rect({
        left: this.position.left,
        top: this.position.top,
        width: this.desired_size.width,
        height: this.desired_size.height,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: this.stroke_width,
        selectable: false
    });

    let text = new fabric.Text(this.label, {
        left: this.position.left,
        top: this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });

    let bound = text.getBoundingRect();
    text.left = this.position.left + this.desired_size.width/2 - bound.width/2;
    text.top = this.position.top + this.desired_size.height/2 - bound.height/2;

    this.size = this.desired_size;

    //
    this.visual_items.push(background);
    this.visual_items.push(text);
    //// 버튼 서식 테스트
    
    this.is_resource_ready = true;
}

WebUI.PushButton.prototype.handleMouseDown = function() {
    if (!this.is_pushed) {
        this.translate({x:0, y:5});
        this.is_pushed = true;

        if (this.onPushed != undefined) {
            this.onPushed.call(this);
        }
        else
            this.handleButtonPushed();
        
        return true;    
    }
    else {
        return false;
    }
}

WebUI.PushButton.prototype.handleMouseUp = function() {
    if (this.is_pushed) {
        this.translate({x:0, y:-5});
        this.is_pushed = false;
        return true;
    }
    else {
        return true;
    }
}

WebUI.PushButton.prototype.handleMouseEnter = function() {
    this.visual_items[0].set('strokeWidth', 3);
    return true;
}

WebUI.PushButton.prototype.handleMouseExit = function() {
    this.visual_items[0].set('strokeWidth', 1);

    if (this.is_pushed) {
        this.translate({x:0, y:-5});
        this.is_pushed = false;
    }

    return true;
}


//
WebUI.Switch = function(is_on, desired_size, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.SWITCH;
    this.is_on = is_on;
    this.desired_size = desired_size;
}

WebUI.Switch.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Switch.prototype.constructor = WebUI.Switch;

WebUI.Switch.prototype.initVisualItems = function() {
    let radius = this.desired_size.width / 4.0;
    let cx = radius * 2.0;
    let cy = radius;

    let center_left = {x: cx - radius, y: cy};
    let center_right = {x: cx + radius, y: cy};

    let theta_range = Math.PI;
    let num_pts = 10;
    let dt = theta_range / (num_pts-1);

    let theta0_left = Math.PI / 2.0;
    let theta1_left = theta0_left + theta_range;
    let theta0_right = -Math.PI / 2.0;
    let theta1_right = theta0_right + theta_range;

    let p0_left = {
        x: center_left.x + Math.cos(theta0_left) * radius,
        y: center_left.y + Math.sin(theta0_left) * radius
    };
    let p1_left = {
        x: center_left.x + Math.cos(theta1_left) * radius,
        y: center_left.y + Math.sin(theta1_left) * radius
    };

    let p0_right = {
        x: center_right.x + Math.cos(theta0_right) * radius,
        y: center_right.y + Math.sin(theta0_right) * radius
    };
    let p1_right = {
        x: center_right.x + Math.cos(theta1_right) * radius,
        y: center_right.y + Math.sin(theta1_right) * radius
    };

    //
    let path_command = "";
    path_command += "M " + p0_left.x + " " + p0_left.y + " ";

    for (let i=0; i < num_pts; i++) {
        let theta = theta0_left + dt * i;
        let p = {
            x: center_left.x + Math.cos(theta) * radius,
            y: center_left.y + Math.sin(theta) * radius
        };
        path_command += "L " + p.x + " " + p.y + " ";
    }

    for (let i=0; i < num_pts; i++) {
        let theta = theta1_left + dt * i;
        let p = {
            x: center_right.x + Math.cos(theta) * radius,
            y: center_right.y + Math.sin(theta) * radius
        };
        path_command += "L " + p.x + " " + p.y + " ";
    }

    path_command += "L " + p0_left.x + " " + p0_left.y + " z";

    //
    let boundary = new fabric.Path(path_command, {
        selectable:     false,
        left:           this.position.left,
        top:            this.position.top,
        stroke:         (this.is_on? 'rgb(48, 209, 88)' : 'rgb(142, 142, 147)'),
        strokeWidth:    2,
        fill:           (this.is_on? 'rgb(48, 209, 88)' : 'rgb(142, 142, 147)'),
    });

    //
    let button_radius = radius * 0.9;
    let button = new fabric.Circle({
        selectable:     false,
        radius:         button_radius,
        left:           this.position.left + (this.is_on? center_right.x - button_radius : center_left.x - button_radius),
        top:            this.position.top + (center_left.y - button_radius),
        stroke:         (this.is_on? 'rgb(48, 209, 88)' : 'rgb(142, 142, 147)'),
        strokeWidth:    3,
        fill:           'white',
    });

    //
    let bound = boundary.getBoundingRect();
    this.size = {width: bound.width, height: bound.height};

    //
    this.visual_items.push(boundary);
    this.visual_items.push(button);
    this.is_resource_ready = true;
}

WebUI.Switch.prototype.handleMouseDown = function() {
    if (this.is_on) {
        this.switchOff();
        console.log("switch off");
    }
    else {
        this.switchOn();
        console.log("switch on");
    }

    return true;
}

WebUI.Switch.prototype.switchOn = function() {
    let boundary = this.visual_items[0];
    let button = this.visual_items[1];

    let radius = this.size.width / 4.0;
    let button_radius = radius * 0.9;

    let cx = this.position.left + radius * 2.0, cy = this.position.top + radius;
    let center_right = {x: cx + radius, y: cy};

    boundary.set('stroke', 'rgb(48, 209, 88)');
    boundary.set('fill', 'rgb(48, 209, 88)');
    button.set('stroke', 'rgb(48, 209, 88)');

    button.animate('left', center_right.x - button_radius, {
        onChange: WebUI.canvas.renderAll.bind(WebUI.canvas),
        duration: 100,
        easing: fabric.util.ease.easeOutBounce,
    });

    this.is_on = true;

}

WebUI.Switch.prototype.switchOff = function() {
    let boundary = this.visual_items[0];
    let button = this.visual_items[1];

    let radius = this.size.width / 4.0 * 0.9;
    let button_radius = radius * 0.9;

    let cx = this.position.left + radius * 2.0, cy = this.position.top + radius;
    let center_left = {x: cx - radius, y: cy};

    boundary.set('stroke', 'rgb(142, 142, 147)');
    boundary.set('fill', 'rgb(142, 142, 147)');
    button.set('stroke', 'rgb(142, 142, 147)');

    button.animate('left', center_left.x - button_radius, {
        onChange: WebUI.canvas.renderAll.bind(WebUI.canvas),
        duration: 100,
        easing: fabric.util.ease.easeOutBounce,
    });

    this.is_on = false;
}

WebUI.MyPushButton = function(label, desired_size, properties) {
    WebUI.PushButton.call(this, label, desired_size, properties);
    this.type = WebUI.WidgetTypes.MY_PUSH_BUTTON;

    this.onPushed = WebUI.MyPushButton.handleButtonPushed;
}

WebUI.MyPushButton.prototype = Object.create(WebUI.PushButton.prototype);
WebUI.MyPushButton.prototype.constructor = WebUI.MyPushButton;

var displayValue = '0';     //
//
WebUI.MyPushButton.prototype.handleButtonPushed = function() {
    let textF = WebUI.widgets[0];
    let textBox = textF.visual_items[1];
    let resultBox = WebUI.widgets[2].visual_items[1];
    let historyBox =  WebUI.widgets[69];    //# HistoryBox

    if(displayValue == '0') displayValue = '';

    if(this.label == 'EV')
    {
        if(displayValue == '')//# 수식 입력 안했으면 결과값 유지
            return;
        try{
            //# 수식 저장
            historyBox.visual_items[2].set('text', historyBox.visual_items[1].text);
            history.push(displayValue);
            historyBox.visual_items[1].set('text', displayValue);

            displayValue = WebUI.parser.eval(displayValue).toString();
            var tokens = displayValue.split(' ');
            if(tokens[0] == 'function')
            {
                displayValue = tokens[0];
            }
            resultBox.set('text', displayValue);
            //# 결과값 저장
            historyValue.push(displayValue);

            displayValue = '0';
        }
        catch (ex)
        {
            displayValue = '0';
            if(displayValue != 'function')
            {
                textBox.set('text', ex.toString());
                console.log(ex.toString());
            }
        }
    }
    else
    {
        if(this.label== 'CL')
        {
            displayValue = '0';
            textBox.set('text', displayValue);
        }
        else if(this.label == '<-') {   //# 텍스트 지우기 버튼
            if(displayValue.length <= 1) {
                displayValue = '0';
                textBox.set('text', displayValue);
            }
            else {
                displayValue = displayValue.substr(0, displayValue.length - 1);
                textBox.set('text', displayValue);
            }
        }
        else if(this.label == 'History') {  //# History 버튼
            
            historyBox.switchVisible();
        }
        else if(this.label == '◀' || this.label == '▶') {
            //# 
        }
        else // 나머지 버튼
        {
            displayValue += this.label;
            textBox.set('text', displayValue);
        }
    }

    WebUI.canvas.requestRenderAll();
}


//# 
WebUI.MyListView = function(label, desired_size, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.MY_LIST_VIEW;
    this.label = [];
    this.label.push(label);
    this.desired_size = desired_size;

    this.stroke_width = 5;
    this.fill_color = '#D3D3D3';
}

WebUI.MyListView.prototype = Object.create(WebUI.Widget.prototype);
WebUI.MyListView.prototype.constructor = WebUI.MyListView;

WebUI.MyListView.prototype.initVisualItems = function() {
    let background = new fabric.Rect({
        left: this.position.left,
        top: this.position.top,
        width: this.desired_size.width,
        height: this.desired_size.height,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: this.stroke_width,
        selectable: false
    });
    text1 = new fabric.Text(this.label[0], {
        left:       this.position.left,
        top:        this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });
    text2 = new fabric.Text(this.label[0], {
        left:       this.position.left,
        top:        this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });

    this.size = this.desired_size;

    text1.left = this.position.left + 10;
    text1.top = this.position.top + 10;

    text2.left = this.position.left + 10;
    text2.top = this.position.top + 50;

    this.visual_items.push(background);
    this.visual_items.push(text1);
    this.visual_items.push(text2);
    this.visible = false;   //# 일단 안보이는 상태로 지정
    this.is_resource_ready = true;
}

WebUI.MyListView.prototype.pushLabel = function(new_label) {
    let leng = this.visual_items.length;
    let text = this.visual_items[leng];

    text = new fabric.Text(this.label[0], {
        left:       this.position.left,
        top:        this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });
    
}

//# 리스트 위치 조정
WebUI.MyListView.prototype.switchVisible = function() {
    let t1 = this.visual_items[1].text;
    let t2 = this.visual_items[2].text;
    
    if(!this.visible) { //#보이게 하기
        this.translate({x:0, y:-750});
        this.visible = true;

        WebUI.widgets[69].visual_items[1].set('text', t1);
        WebUI.widgets[69].visual_items[2].set('text', t2);

        WebUI.widgets[69].visual_items[1]
    }
    else {
        this.translate({x:0, y:750});
        this.visible = false;

    }
    WebUI.canvas.requestRenderAll();
}

//
$(document).ready(function() {    
    WebUI.initialize();
    
    WebUI.widgets[69].translate({x:0, y:100});//# 
});