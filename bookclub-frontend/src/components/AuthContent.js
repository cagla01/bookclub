import * as React from "react";
import axios from "axios";

export default class AuthContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            user: null,
        };
    }

    componentDidMount() {
        this.fetchMessage();
        this.fetchUserDetails();
    }

    fetchMessage = () => {
        axios
            .get("/auth/messages/welcome", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                this.setState({ message: response.data });
            })
            .catch((error) => {
                console.error("Error fetching message:", error);
            });
    };

    fetchUserDetails = () => {
        axios
            .get("/users/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                this.setState({ user: response.data });
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
            });
    };

    render() {
        const { user } = this.state;

        return (
            <div>
                <h1>Welcome Back, {user?.fullName || "Book Lover"}! 📖</h1>
                <p>
                    Welcome to your book club — your literary journey starts here! As a valued
                    member, you're at the heart of our community, where
                    books bring us together.
                </p>
                <p>Here's how you can get involved:</p>
                <ul>
                    <li>
                        Recommend Your Favorite Books: Add books to our club’s list and inspire
                        others with your reading choices.
                    </li>
                    <li>
                        Vote for What’s Next: Every month you’ll get to vote on the books you
                        want to read and the winning title will become the focus of our next
                        adventure!
                    </li>
                    <li>
                        Join the Discussion: Dive into our discussion
                        board to share thoughts, reflections, and insights with fellow readers.
                    </li>
                    <li>
                        Stay Updated on Events: Keep track of upcoming events to connect with
                        fellow book lovers and don’t miss the chance to be part of our community
                        activities.
                    </li>
                </ul>
                <p>
                    Happy reading and we can’t wait to hear your thoughts on the next book!
                </p>
            </div>
        );
    }
}
