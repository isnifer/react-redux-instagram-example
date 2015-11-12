export const loadOnScrollBottom = ({dispatch, action, userId, that}) => {
    $(window).off('scroll');
    $(window).on('scroll', function() {
        if($(this).scrollTop() + $(this).height() == $(document).height()) {
            dispatch(action({url: that.props.model.pagination.next_url, userId}));
        }
    });
};
