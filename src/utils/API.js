import axios from 'axios';
const headers = {
    'Content-Type': 'application/json'
}
const burl = "http://localhost:8000"

export default {
    login : function(email,password) {
        return axios.post(burl + '/user/login',{
            'email' : email,
            'password' : password
        },{
            headers: headers
        })
    },
    signup : function(send){
        return axios.post(burl + '/user/signup',send,{headers: headers})
    },

    isAuth : function() {
        return (localStorage.getItem('token') !== null);
    },
    logout : function() {
        localStorage.clear();
    },
    checkToken : function(token) {
        return axios.post(burl + '/user/checkToken',{'token':token},{headers: headers})
    },
    createActivity : function(min,max,step,name,group_id) {
        return axios.post(burl + '/activity/create',{
            'min' : min,
            'max' : max,
            'name' : name,
            'group_id' : group_id,
            },
            {headers: headers})
    },
    indexActivity : function(group_id) {
        return axios.get(burl + '/activity/index',{
            params: {
                group_id: group_id
            }
        },
            {headers: headers})
    },
    indexGroup : function(user_id) {
        return axios.get(burl + '/group/index',{
            params: {
                user_id: user_id
            }
        },
            {headers: headers})
    },
    createGroup : function(name,user_id) {
        return axios.post(burl + '/group/create',
            {
                'name': name,
                'user_id': user_id
        },
            {headers: headers})
    },
    showGroup : function(group) {
        return axios.get(burl + '/group/show',{
                params: {
                    group_id: group
                }
            },
            {headers: headers})
    },
    createMood : function(value,label,activity,note) {
        return axios.post(burl + '/mood/create',
            {
                'value': value,
                'label': label,
                'note': note,
                'activity_id': activity
        },
            {headers: headers})
    },
    showActivity : function(activity) {
        return axios.get(burl + '/activity/show',{
                params: {
                    activity_id: activity
                }
            },
            {headers: headers})
    },
}
