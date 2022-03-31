import { gql } from "@apollo/client";

export const ADD_SETTINGS = gql`
mutation MyMutation($forem_key: String = "", $hashnode_key: String = "", $medium_key: String = "", $medium_username: String, $user_id: String = "", $id: Int = 10) {
    insert_settings(objects: {forem_key: $forem_key, hashnode_key: $hashnode_key, id: $id, medium_key: $medium_key, medium_username: $medium_username, user_id: $user_id}) {
      affected_rows
    }
  }
  
`;

export const DISPLAY_SETTINGS = gql`
query Settings($user_id: String = "") {
    settings(where: {user_id: {_eq: $user_id}}) {
      forem_key
      hashnode_key
      id
      medium_key,
      medium_username
    }
  }
  `
export const UPDATE_SETTINGS = gql`
mutation updateSettings($forem_key: String = "", $hashnode_key: String = "", $medium_key: String = "", $medium_username: String = "", $user_id: String = "") {
    update_settings(where: {user_id: {_eq: $user_id}}, _set: {forem_key: $forem_key, hashnode_key: $hashnode_key, medium_key: $medium_key, medium_username: $medium_username}) {
      affected_rows
    }
  }  
`

export const FIND_SETTINGS_ID_BY_USER = gql `
query FindSettingsIdbyUser($user_id: String = "") {
    settings(where: {user_id: {_eq: $user_id}}) {
      id
    }
  }
  `

export const ADD_POST = gql`
mutation AddPostMutation($author: String = "", $link: String = "", $post_created_at: timestamptz = "", $post_id: uuid = "", $post_name: String = "", $user_id: String = "", $hashnode: String = "", $forem: String = "", $medium: String = "") {
  insert_post(objects: {author: $author, link: $link, post_created_at: $post_created_at, post_id: $post_id, post_name: $post_name, user_id: $user_id, hashnode: $hashnode, forem: $forem, medium: $medium }) {
    affected_rows
  }
}
`