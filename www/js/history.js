var History = function () {
    // private members
    this.List = [];
};

History.prototype.RenderList = function () {                    
    if (this.List.length > 0) {
        var return_list = [],
            list_length = this.List.length,
            i;
        
        for (i = 0; i < list_length; i += 1) 
            return_list.push(this.List[i]);
        
        this.List.length = 0;
        return return_list;
    }
    else
        return null;
};

History.prototype.AddToList = function (item) {
    this.List.unshift(item);
};