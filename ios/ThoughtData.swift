//
//  ThoughtData.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/28.
//

import Foundation

struct Thought {
    var booktitle: String
    var author: String?
    var bookimage: String?
    var thoughts: String
    var page: String?
    var readingtime: String?
    var date: Date
    init(booktitle: String, thoughts: String, date: Date ){
        self.booktitle = booktitle
        self.thoughts = thoughts
        self.date = date
    }
}

class ThoughtData : ObservableObject {
    let auth = Auth.provider


    func thoughtCreateBackend(Thought: Thought){
        let formatDate = dateFormatJapan(date: Thought.date)

        let reqBody = "booktitle=\(Thought.booktitle)&author=\(Thought.author!)&bookimage=\(Thought.bookimage!)&thoughts=\(Thought.thoughts)&page=\(Thought.page!)&readingtime=\(Thought.readingtime!)&date=\(formatDate)&userid=\(auth.userid!)"


        guard let book_post_url = URL(string: backendUrl+"/restricted/books") else {
            return
        }
        var req = URLRequest(url: book_post_url)
        req.httpMethod = "POST"
        print(auth.token!)
        if auth.token != nil {
            req.allHTTPHeaderFields = ["Authorization": "Bearer \(auth.token!)"]
        }
        req.httpBody = reqBody.data(using: .utf8)
        let session = URLSession.shared
        session.dataTask(with: req) { (data, response, error) in
            if error == nil, let data = data, let response = response as? HTTPURLResponse {
                print("Content-Type: \(response.allHeaderFields["Content-Type"] ?? "")")
                print("statusCode: \(response.statusCode)")
                print(String(data: data, encoding: .utf8) ?? "")
            }
        }.resume()
            }

    private func dateFormatJapan(date: Date) -> String {
        let format = DateFormatter()
        format.dateFormat = "yyyyMMddHHmmss"
        format.timeZone = TimeZone(identifier: "Asia/Tokyo")
        let formatDate = format.string(from: date)
        print(formatDate)
        return formatDate
    }
}
