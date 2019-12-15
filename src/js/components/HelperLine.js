var distance_btw_words = 20;            // define the minimal distance between two letters such that
                                        // they belong to two differents words
                                        // Also, the automatic space between two words

var guide_new = 0;

export function updateGuide(){
    // console.log('guidenew6:', guide_new != 0 ? guide_new[0]['data'] : 0)
    return guide_new;
}

export function distance_guides(guides){
    let average_first_guide = average(guides[0]);
    let average_second_guide = average(guides[1]);
    let distance = Math.abs(average_first_guide[1] - average_second_guide[1]);
    return distance;
}

function new_guide(origin_guide,distance){
    // Duplicate de last guide and shift it in the y-axis by index-1 * distance between the first one and the last one
    let n = origin_guide.length;
    // let temp_guide = [origin_guide[n-1]].slice();
    let temp_guide = [{'data': [],'id': 'temp','type':'path'},-1];
    let m = origin_guide[n-1]['data'].length;
    // temp_guide.push(-1);
    for (let i = 0; i < m; i++){
        // temp_guide[0]['data'][i][1] += ((index-1) * distance);
        let coord = origin_guide[n - 1]['data'][i];
        temp_guide[0]['data'].push([coord[0],coord[1]+distance]);
    }
    temp_guide[0]['id'] = 'guide' + (n+1).toString();
    // console.log('DEBUG2: ', origin_guide,temp_guide[0]['data'])
    return temp_guide;
}

export function computeLine(canvas, lin, guide, original_guide,dist){

    // Unify all letters that are closed enought into a single word
    // First look if there are enough free space of the guide to put the word, else go to the next guide
    // Automatically create new guides if there is not enough space
    // original_guide is the original guide that will not be modified
    // dist is the distance between the first and the second guide, used to create new ones

    let line = JSON.parse(JSON.stringify(lin));
    let lines = rearrange_lines(line, 0);

    let guide_temp = JSON.parse(JSON.stringify(guide));                 // make a copy that is reduiced every time a new word is placed

    for (let ith_line = 0; ith_line < lines.length; ith_line++){

        let n = lines[ith_line]['data'].length;

        var average_line = average(lines[ith_line]);

        guide_temp[0]['data'] = straight_guide(guide_temp[0]);

        var average_guide = average(guide_temp[0]);

        // var orientation_line = average_line[6];

        // var average_guide_x = average_guide[0];               // middle point in the x axis
        // var average_guide_y = average_guide[1];               // middle point in the y axis
        var average_guide_left = average_guide[2];
        var average_guide_right = average_guide[3];
        // var average_guide_inf = average_guide[4];             // average of the infimums
        // var orientation_guide = average_guide[6];
        var orientation_guide = orientation_straight_guide(guide_temp[0]['data'])

        var lines_bis = JSON.parse(JSON.stringify(lines));

        // lines[ith_line]['data'] = rotate_line(lines_bis[ith_line]['data'], orientation_line, 0);            // make to word horizontal

        average_line = average(lines[ith_line]);

        // var average_line_x = average_line[0];               // middle point in the x axis
        var average_line_y = average_line[1];               // middle point in the y axis
        var average_line_left = average_line[2];            // far left point
        var average_line_right = average_line[3];           // far right point
        var average_line_inf = average_line[5];             // average (4), median (5) of the infimums
        // var orientation_line = average_line[6];

        var size_word = Math.abs(average_line_left - average_line_right);
        var new_size_word = size_word * Math.cos(Math.atan(orientation_guide));            // getting the size of the word when it is not horizontal
        var size_guide = Math.abs(average_guide_left - average_guide_right);

        if (new_size_word <= size_guide){

            let new_guide_temp = [{'data' : [],'id': 'NI' },{'data': [],'id':'NII'}];             // creating a new guide temp with only the size of the word so it's easier to get the orientation
            new_guide_temp[0]['data'].push(guide_temp[0]['data'][0]);
            var limit_point = average_guide_left + new_size_word;           // the x coordinate where the word finishes
            let i = 1;
            while (new_guide_temp[0]['data'][i-1][0] < limit_point && i < guide_temp[0]['data'].length-1){             // while w coordinate of the last point is < to the limit point
                new_guide_temp[0]['data'].push(guide_temp[0]['data'][i]);        // reduce the guide to the size of the word
                i ++;
            }

            new_guide_temp[0]['data'] = rotate_line(new_guide_temp[0]['data'],orientation_guide,0);             // create a new temp guide that is horizontal to fix the word

            var average_new_guide = average(new_guide_temp[0]);
            var average_guide_y = average_new_guide[1];
            var average_new_guide_left = average_new_guide[2];

            var diff_y_points = average_guide_y - average_line_y - Math.abs(average_line_y - average_line_inf);

            for (let i = 0; i < n; i++) {
                lines[ith_line]['data'][i][0] += (average_new_guide_left - average_line_left);      // diff_left_points;
                lines[ith_line]['data'][i][1] += diff_y_points;
            }

            lines[ith_line]['data'] = rotate_line(lines[ith_line]['data'], 0, orientation_guide);
            
            while (guide_temp[0]['data'][0][0] <= average_guide_left + new_size_word + distance_btw_words) {        // reduce the old guide, not the horizontale one
                guide_temp[0]['data'].shift();
                if (guide_temp[0]['data'].length < 2){
                    break;
                }
            }
        }
        else {
            lin = separates_lines(lines.slice(0, ith_line), 0);             // take the first ith elements
            canvas.updateLines(lin);
            if (guide[1] != -1){
                if (guide.length == 2){
                    return computeLine(canvas, lines.slice(ith_line), [guide[1],-1],original_guide,dist);
                }
                return computeLine(canvas, lines.slice(ith_line), guide.slice(1), original_guide, dist);
            }
            else {
                // console.log('original guide: ',original_guide)
                let ori = original_guide[original_guide.length - 1];
                if (new_size_word > (ori['data'][1][0] - ori['data'][0][0]) && guide_temp[0]['data'][0][0] == ori['data'][0][0]) {   
                    // console.log(guide_temp,original_guide.length)  
                    // console.log(guide_temp[0]['id'],ori['id'])                                                                    // if size of word bigger than last guide -> bigger than all of the new ones
                    lines[ith_line]['data'] = resize([lines[ith_line]['data']], (ori['data'][1][0] - ori['data'][0][0]) / new_size_word * 0.99)[0];    // reduce the size of the word to fit in the guide
                    // var average_line = average(lines[ith_line]);
                    // var size_word = Math.abs(average_line[2]-average_line[3]);
                    // console.log(size_word * Math.cos(Math.atan(orientation_guide)), ori[1][0] - ori[0][0]);
                    return computeLine(canvas,lines.slice(ith_line),guide,original_guide,dist);
                }
                var str_ori = original_guide[original_guide.length-1]['id'];          // id of last guide of the original
                var index_ori = parseInt(str_ori.charAt(str_ori.length-1));

                var str_new = guide_new != 0 ? guide_new[0]['id'] : '0';               // id of the new one
                var index_new = parseInt(str_new.charAt(str_new.length - 1));

                if (index_new == (index_ori + 1)){              // otherwise the new new guide would be the same as the new guide (i.e original guide is net updated via Document.js yet)
                    original_guide.push(guide_new[0]);
                }
                guide_new = new_guide(original_guide,dist);
                return computeLine(canvas, lines.slice(ith_line),guide_new,original_guide,dist);
            }
        }
    }   
    lin = separates_lines(lines,0);
    canvas.updateLines(lin);
    return remove_points(guide_temp);             // return the first and the last element 
}

function resize(L, s) {
    if (s == 1) {
        return L;
    }
    var list2 = [];
    for (let i = 0; i < L.length; i++) {
        let temp = [];
        for (let j = 0; j < L[i].length; j++) {
            temp.push([Math.round(L[i][j][0] * s * 1000) / 1000, Math.round(L[i][j][1] * s * 1000) / 1000]);
        }
        list2.push(temp);
    }
    return list2;
}

function orientation_straight_guide(guide){
    // return the orientation when guide is a straight line, more accurate than linear regression
    let A = guide[0];
    let n = guide.length;
    let B = guide[n-1];
    return (B[1]-A[1])/(B[0]-A[0]);
}

export function create_line(listes) {
    let n = listes.length;
    let new_lines = [];
    for (let i = 0; i < n; i++) {
        let dict = {};
        dict['data'] = listes[i];
        dict['id'] = 'writing' + (i + 1).toString();
        new_lines.push(dict);
    }
    // console.log(new_lines)
    return new_lines;
}

function remove_points(guide){
    // return the guide with only the first and last point
    let n = guide[0]['data'].length;
    if (n != 0){
        let v1 = guide[0]['data'][0];
        let v2 = guide[0]['data'][n-1];
        guide[0]['data'] = [v1,v2];
    }
    return guide;
}

function rotate_line(line,angle_line,angle_guide){
    // Line is a list
    // Rotate all points of line by 'rotation angle' := previous angle - new angle
    let res = [];
    let rotation_angle = Math.atan(angle_line - angle_guide);
    for (let i =0; i < line.length;i++){
        let x = line[i][0];
        let y = line[i][1];
        let r = Math.sqrt(x*x+y*y);
        let angle = y >= 0 ? Math.acos(x / r) : -Math.acos(x / r);
        res.push([r*Math.cos(angle-rotation_angle),r*Math.sin(angle - rotation_angle)]);
    }
    return res
}

function straight_guide(guide){
    // create a straight line based on the linear regression
    // let temp = linear_regression(guide['data']);
    // const a = temp[0];
    // const b = temp[1];
    const a = orientation_straight_guide(guide['data']);
    const b = guide['data'][0][1] - a*guide['data'][0][0];
    let average_guide = average(guide);
    let x1 = average_guide[2];
    let distance = average_guide[3] - x1;           // size of the guide
    let res = [];
    for (let i = 0; i <= 100; i++){
        let temp_x = Math.round((x1 + i * distance / 100) * 1000) / 1000 ;
        res.push([temp_x,Math.round((a*temp_x+b)*1000)/1000]);
    }
    return res;
}

function linear_regression(list){
    // list = [...,[x_i,y_i],...]
    // best fit y_i = a*x_i + b
    let n = list.length;
    let ave_x = 0;
    let ave_y = 0;
    for (let i =0; i < n; i++){
        ave_x += list[i][0];
        ave_y += list[i][1];
    }
    ave_x /= n;
    ave_y /= n;
    let u = 0;
    let v = 0;
    for (let i = 0; i < n; i++) {
        let temp = list[i][0] - ave_x;
        u += temp*(list[i][1] - ave_y);
        v += Math.pow(temp,2);
    }
    let a = u/v;
    let b = ave_y - ave_x*a;
    return [a,b];
}

function separates_lines(lin,index){
    // let lines = lin.slice();                 // make a copy   // ACTUALLY IT DOESNT
    let lines = JSON.parse(JSON.stringify(lin));
    let n = lines.length;
    if (index > n-1){
        return lines;
    }
    let p = lines[index]['data'].length;
    if ('size' in lines[index]){
        let m = lines[index]['size'].length;
        if (m != 0){
            lines.splice(index+1,0,{'data': [], 'id': lines[index]['temp id'][m-1]})        // create a new dictionnary at index+1
            // console.log('DEBUG: ',lines[index]['size'][m - 1],p)
            for (let i = lines[index]['size'][m - 1]; i < p; i++){
                lines[index+1]['data'].push(lines[index]['data'][i]);           // put all the last elements in the new dictionnary
            }
            for (let i = lines[index]['size'][m - 1]; i < p; i++) {
                lines[index]['data'].splice(i);                                 // remove them from the first one
            }
            lines[index]['size'].splice(m-1);                   // remove the last element of size
            return separates_lines(lines,index);
        }
    }
    return separates_lines(lines,index+1);
}

function rearrange_lines(lin,index){
    let lines = JSON.parse(JSON.stringify(lin));
    // merge two consecutives lines if their distance is less than 25 pixels
    if (lines.length == 1 || lines.length <= index+1){              // if only one element or already iterated over all the elements
        return lines;
    }
    let temp0 = average(lines[index]);
    let temp1 = average(lines[index+1]);
    if ((temp1[2] - temp0[3]) < distance_btw_words && (temp1[1] - temp0[1]) < 3*distance_btw_words){ // then they belong to the same word
        // Two letter belong to the same word if the far left point of the second one is 
        // not more than 'distance_btw_words' (25) pixels away on the right from the far right point of the first one
        // And if their vertical distance is less than 2*'distance_btw_words' (otherwise, it's a new line, so diff word)
        if ('size' in lines[index]) {
            lines[index]['size'].push(lines[index]['data'].length);         // keep track of the size of all letters
            lines[index]['temp id'].push(lines[index+1]['id']);
        }
        else {
            lines[index]['size'] = [lines[index]['data'].length];
            lines[index]['temp id'] = [lines[index+1]['id']];
        }
        for (let i = 0; i < lines[index+1]['data'].length;i++){
            lines[index]['data'].push(lines[index+1]['data'][i]);           // put all element of line at index+1 in line at index
        }
        lines.splice(index+1,1);                                            // remove index+1 in lines
        return rearrange_lines(lines,index);
    }
    return rearrange_lines(lines,index+1);
}

function average(obj){
    // INPUT: object (guide or line)
    // OUTPUT: list of: 
    //         0 - average of the coordinates of points in x, 
    //         1 - in y, 
    //         2 - the most left point, 
    //         3 - the most right point, 
    //         4 - the average of the infimum 
    //         5 - median of the infimum
    //         6 - orientation

    // console.log('OBJ: ',obj['data'],obj['data'][0]);

    let n = obj['data'].length;              // size first line
    let sum_x = 0;
    let sum_y = 0;
    let sum_inf = 0

    let min_left = obj['data'][0][0];              // first element in the list in coordinate x
    let max_right = obj['data'][n - 1][0];            // last element in the list in x

    //let inf = [...Array(1000).keys()];              // Array from 0 to 100
    let inf = new Array(Math.round(n/3)).fill(0);

    for (let i = 0; i < n; i++){
        sum_x += obj['data'][i][0];
        sum_y += obj['data'][i][1];
        if (0 <= i <= 50){
            min_left = obj['data'][i][0] < min_left ? obj['data'][i][0] : min_left;                   // get the far left point
        }
        if (n-50 <= i <= n){
            max_right = obj['data'][i][0] > max_right ? obj['data'][i][0] : max_right;                // git the far right point
        }
        if (obj['data'][i][1] > inf[0]){
            inf[0] = obj['data'][i][1];
            inf.sort(function(a,b){return a - b});
        }
    }
    for (let i = 0; i < inf.length; i ++){
        sum_inf += inf[i];
    }
    let med = inf[Math.round(inf.length / 2)];
    return [sum_x/(n),sum_y/(n),min_left,max_right,sum_inf/inf.length,med,linear_regression(obj['data'])[0]];
}

function get_extrem_line(line){
    let n = line['data'].length;
    
    let min_left = line['data'][0][0];              // first element in the list in coordinate x
    let max_right = line['data'][n - 1][0];            // last element in the list in x

    for (let i = 1; i < Math.min(50,n); i++){
        min_left = line['data'][i][0] < min_left ? line['data'][i][0] : min_left;                   // get the far left point between the first 5O points
    }
    for (let i = Math.max(n-50,0); i < n-1; i++) {
        max_right = line['data'][i][0] > max_right ? line['data'][i][0] : max_right;                // git the far right point
    }
    return [min_left,max_right];
}

function test_extrem(lines){
    let n_0 = lines['data'].length;

    let min_max = get_extrem_line(lines);

    for (let i = 0; i < 50; i++) {
        if (lines['data'][i][0] == min_max[0]) {
            lines['data'][i][0] -= 30;
            min_max[0] -= 1;
        }
        if (lines['data'][n_0 - i - 1][0] == min_max[1]) {
            lines['data'][n_0 - i - 1][0] += 30;
            min_max[1] += 1;
        }
    }
    return lines;
}