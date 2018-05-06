import '../css/footer.styl'
export default{
    data(){
        return{
            author:'ddd'
        }
    },
    render(){
        return(
            <div id="footer">
                <span>copyright by {this.author}</span>
            </div>
        )
    }
}