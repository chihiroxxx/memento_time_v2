//
//  UserData.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/27.
//

import Foundation

class UserData: ObservableObject {
    struct UserDetail: Codable {
        let userName: String
        let password: String
    }
    struct UserReponseJson: Codable {
        let token: String?
        let userid: String?
    }
    func loginBackend(userName: String, password: String){
        guard let login_url = URL(string: backendUrl+"/login") else {
            return
        }
        var req = URLRequest(url: login_url)
        req.httpMethod = "POST"
        req.httpBody = "name=\(userName)&password_digest=\(password)".data(using: .utf8)

        let session = URLSession.shared
        let task = session.dataTask(with: req, completionHandler: {
            (data, response, error) in
            if error == nil, let data = data, let response = response as? HTTPURLResponse {
                if response.statusCode == 200 {
                    print("ログインOK！！")

                    do {
                        let decoder = JSONDecoder()
                        let json = try decoder.decode(UserReponseJson.self, from: data)
                        let auth = Auth.provider
                        auth.token = json.token!
                        auth.userid = json.userid
                    } catch {
                        print("jsonエラー...")
                    }

                } else {
                    print("ログインエラー...")
                }

               }

        })
        task.resume()
    }
}
