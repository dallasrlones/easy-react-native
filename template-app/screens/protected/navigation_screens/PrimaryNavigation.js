const PrimaryNavigation = ({ elements }) => {
    const { DIV, A, BR, CENTER } = elements;
    
    return (
        <DIV>
            <BR size={50} />
            <CENTER type="both">
                <A screen="Home">Home</A>
                <A screen="Profile">Profile</A>
                <A screen="Logout">Logout</A>
            </CENTER>
        </DIV>
    )
};

export default PrimaryNavigation;