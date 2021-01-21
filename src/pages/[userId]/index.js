import {gql, useSubscription} from "@apollo/client";

const NEW_REACTION = gql`
    subscription newReaction {
        newReaction {
            uuid
            content
            message {
                uuid
                from
                to
            }
        }
    }
`

const Profile = () => {

    const { data: reactionData, error: reactionError } = useSubscription(
        NEW_REACTION
    )

    return (
        <h1>This profile</h1>
    )
}

export default Profile
