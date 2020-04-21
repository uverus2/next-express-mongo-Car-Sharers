import qs from 'qs';

function getFormData(object) {
    const formData = new URLSearchParams();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
};


const postOptionsObject = (data, url) => {
    return {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: url,
    };
};

const putOptionsObject = (data, url) => {
    return {
        method: 'PUT',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: url,
    };
};

const getOptionsObject = (url) => {
    return {
        method: 'GET',
        url: url,
    };
};

const auth = ctx => {

    if (typeof ctx.req.session.passport === "undefined" || !ctx.req.session.passport.user) {
        ctx.res.redirect("/login");
    }
    if (ctx.req.session.passport.user.interests.length <= 0 || ctx.req.session.passport.user.gender === "None") {
        ctx.res.redirect("/additional-reg");
    }
};

module.exports = {
    getFormData,
    postOptionsObject,
    getOptionsObject,
    auth,
    putOptionsObject
}