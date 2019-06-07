

export default class Utility {
    
    static myInstace = null;
    static sharedInstance() {
        if (Utility.myInstace == null) {
            Utility.myInstace = new Utility();
        }
        return this.myInstace
    }


} 